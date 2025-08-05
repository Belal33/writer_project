import { CustomButton } from "@/components/forms/formFiels/customButton";
import postCreateQABoxResourceAction from "@/endpointActions/postCreateQABoxResourceAction";
import postCreateResourceAction from "@/endpointActions/postCreateResourceAction";
import useCurrentQaBoxFetcher from "@/swrDataFetcher/currentQaBoxFetcher";
import {
	FilePlus2,
	UploadIcon,
	FileIcon,
	XIcon,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import React, { useState } from "react";
import pdfToText from "react-pdftotext";

export default function SingleResourceUploader({
	qaBoxId,
}: {
	qaBoxId?: string;
}) {
	const { mutate } = useCurrentQaBoxFetcher(qaBoxId || "");
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const [abstract, setAbstract] = useState<string | null>(null);
	const [textFile, setTextFile] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<
		"initial" | "uploading" | "reading" | "success" | "fail"
	>("initial");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			setFile(e.target.files[0]);
			const isPdf = e.target.files[0].type === "application/pdf";

			if (isPdf) {
				setStatus("reading");
				pdfToText(e.target.files[0])
					.then((text) => {
						let abstractText: string = "";
						let splitedStr = text.toLowerCase().split("abstract");

						if (text && splitedStr.length > 1) {
							abstractText = splitedStr.pop()?.slice(0, 500) + "...";
						} else {
							splitedStr = text.toLowerCase().split("summary");
							if (text && splitedStr.length > 1) {
								abstractText = splitedStr?.pop()?.slice(0, 500) + "...";
							} else {
								abstractText = text?.slice(0, 500) + "...";
							}
						}
						setAbstract(abstractText);
						setTextFile(text);
						setStatus("initial");
					})
					.catch((error) => {
						console.error("Failed to read PDF", error);
						setStatus("fail");
					});
			}else{
				setStatus("fail");
			}
		}
	};

	const handleUpload = async () => {
		if (textFile && file) {
			setStatus("uploading");
			try {
				await (qaBoxId
					? postCreateQABoxResourceAction({
							text_source: textFile,
							name: file.name,
							type: "pdf",
							qaBoxId,
					  })
					: postCreateResourceAction({
							text_source: textFile,
							name: file.name,
							type: "pdf",
					  }));

				mutate();
				setFile(null);
				setAbstract(null);
				setTextFile(null);
				setStatus("success");

				setTimeout(() => setStatus("initial"), 2000);
			} catch (error) {
				console.error("Upload failed", error);
				setStatus("fail");
			}
		} else {
			setStatus("fail");
		}
	};

	const clearFile = () => {
		setFile(null);
		setAbstract(null);
		setTextFile(null);
		setStatus("initial");
		if (inputFileRef.current) {
			inputFileRef.current.value = "";
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<CustomButton dark onClickFunc={() => inputFileRef.current?.click()}>
					<FilePlus2 size={16} />
					Choose PDF
				</CustomButton>
				<input
					ref={inputFileRef}
					className="hidden"
					id="file"
					type="file"
					accept=".pdf"
					onChange={handleFileChange}
				/>
					<div className="flex-1 flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md border border-gray-200">
						{file ? (
							<>
							<div className="flex items-center gap-2">
							<FileIcon size={16} className="text-gray-500" />
							<span className="text-sm text-gray-800">{file?.name}</span>
						</div>
						<button
							onClick={clearFile}
							className="p-1 hover:bg-gray-200 rounded-full"
						>
							<XIcon size={14} className="text-gray-500" />
						</button>
							</>
						):
						(
							<span className="text-sm text-gray-500">
								No file selected
							</span>
						)}
					</div>
			</div>

			{status === "reading" && (
				<div className="flex items-center gap-2 text-sm text-primary">
					<div className="animate-spin">
						<UploadIcon size={16} />
					</div>
					Reading PDF content...
				</div>
			)}

			{file && abstract && (
				<div className="space-y-3">
					<div className="p-4 bg-gray-50 rounded-md border border-gray-200">
						<h4 className="text-sm font-medium text-gray-800 mb-2">
							Preview
						</h4>
						<div className="text-sm text-gray-600 max-h-32 overflow-y-auto scrollbar-custom">
							{abstract}
						</div>
					</div>

					{file.type === "application/pdf" && (
						<div className="flex justify-end">
							<CustomButton dark onClickFunc={handleUpload}>
								<UploadIcon size={16} />
								Add Resource
							</CustomButton>
						</div>
					)}
				</div>
			)}

			{status === "success" && (
				<div className="flex items-center gap-2 text-sm text-green-600">
					<CheckCircle size={16} />
					File uploaded successfully!
				</div>
			)}

			{status === "fail" && (
				<div className="flex items-center gap-2 text-sm text-red-500">
					<AlertCircle size={16} />
					File upload failed. Please try again.
				</div>
			)}
		</div>
	);
}
