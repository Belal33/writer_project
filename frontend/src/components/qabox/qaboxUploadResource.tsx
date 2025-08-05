import useCurrentQaBoxFetcher from "@/swrDataFetcher/currentQaBoxFetcher";
import SingleResourceUploader from "./uploadResourceFileField";
import MainLoader from "../mainLoader";
import ConnectionErrorMessage from "../connectionErrorMessage";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import pagePaths from "@/urlPaths/pagePaths";

export default function QABoxUploadResource({
	qaBoxId,
	className,
}: {
	className?: string;
	qaBoxId: string;
}) {
	const { qaBox, isLoading, isError } = useCurrentQaBoxFetcher(qaBoxId);

	if (isLoading) return <MainLoader />;
	if (isError) return <ConnectionErrorMessage />;

	return (
		<div className={`${className} w-full border-b  space-y-6`}>
			<h2 className="p-3 border-b py-6 sm:p-5 font-bold text-primary">
				 <Link href={`${pagePaths.qaBoxPage}/${qaBoxId}`}>
				<span className="text-primary text-lg">QA Box </span>|
				{qaBox.name}
				</Link>
			</h2>
			<div className=" px-3 sm:px-5 border-gray-200 pt-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Add New Resource
				</h3>
				<div>
					<SingleResourceUploader qaBoxId={qaBoxId} />
				</div>
			</div>
			<div className="space-y-4 ">
				<h3 className="text-lg px-3 sm:px-5 font-semibold text-gray-900">
					Knowledge Base Resources
				</h3>

				{qaBox.resources.length > 0 ? (
					<div className="grid grid-cols-1 border-t md:grid-cols-2 lg:grid-cols-3 p-3 sm:p-5 gap-6 max-h-[20vh] overflow-y-auto w-full bg-main ">
						{qaBox.resources.map((resource) => (
							<QARsourceBox key={resource.id} resource={resource} />
						))}
					</div>
				) : (
					<div className="text-center px-3 sm:px-5 py-12">
						<div className="mx-auto h-12 w-12 text-gray-400 mb-4">
							<svg
								className="h-full w-full"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								/>
							</svg>
						</div>

						<h3 className="text-sm font-semibold text-gray-900 mb-1">
							No resources yet
						</h3>
						<p className="text-sm text-gray-500 mb-6">
							Get started by creating your first resource
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

function QARsourceBox({ resource }: { resource: QAResourceInterface }) {
	return (
		<div
			key={resource.id}
			className="group relative bg-white rounded-xl shadow-md ring-1 ring-gray-900/5 p-6 transition duration-200 hover:shadow-xl"
		>
			<div className="flex items-center gap-3 mb-4">
				<BookOpen size={20} className="shrink-0 text-active" />
				<h4 className="font-semibold text-gray-800 truncate">
					{resource.name}
				</h4>
			</div>
			<div className="flex justify-between items-center text-xs text-gray-500">
				<span>Type: {resource.type}</span>
				<span>Chunks: {resource.chucks_number}</span>
				<span>{new Date(resource.created_at).toLocaleDateString()}</span>
			</div>
			<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
		</div>
	);
}