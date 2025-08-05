"use client";
import Loading from "@/app/loading";
import postCreateAnswerBoxAction, {
	QABoxAnswerInterface,
} from "@/endpointActions/postCreateAnswerBoxAction";
import { uuidRegex } from "@/regex/uuid";
import useCurrentQaBoxFetcher from "@/swrDataFetcher/currentQaBoxFetcher";
import { notFound } from "next/navigation";
import { useState } from "react";
import QABoxResult from "./qaboxResult";
import QABoxUploadResource from "./qaboxUploadResource";
import { SendHorizonalIcon } from "lucide-react";

export default function QABox({
	id,
	className,
}: {
	id: any;
	className?: string;
}) {
	const { qaBox, isLoading, isError } = useCurrentQaBoxFetcher(id);
	const [answers, setAnswers] = useState<QABoxAnswerInterface[]>();
	const [query, setQuery] = useState("");

	function sendQuery() {
		return postCreateAnswerBoxAction({
			qaBoxId: id,
			query: query,
		}).then((res) => {
			setAnswers(res.data);
		}).catch((e) => {console.log(e)
		});
	}
	if (id && !uuidRegex.test(id)) return notFound();
	if (isError)
		return (
			<div className="text-red-500 text-center text-xl">Failed to load</div>
		);
	return (
		<div className={className}>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<div className="bg-white sticky top-0">
						
						<QABoxUploadResource qaBoxId={id} />
					</div>
					<div>
						{answers?.map((answer) => {
							return <QABoxResult key={answer[1]} qaBoxResult={answer} />;
						})}
					</div>

					<div className="max-w-5xl fixed w-4/5 bottom-10 left-1/2 -translate-x-1/2  flex items-center justify-center rounded-3xl p-2 shadow-2xl bg-primary sm:m-auto px-5">
						<input
							type="text"
							value={query}
							disabled={qaBox.resources.length == 0}
							onChange={(e) => setQuery(e.target.value)}
							// className="text-center block w-full m-4 mx-auto max-w-5xl p-5 text-lg outline-none bg-primary rounded-full"
							className="block  w-full rounded-[20px] border bg-main  max-h-[200px] py-3 px-4 overflow-y-auto scrollbar-hide focus:outline-none"
							onKeyDown={async (e) => {
								if (e.key === "Enter") {
									if (query && qaBox.resources.length) {
										await sendQuery();
									}
								}
							}}
						/>
						<button
							disabled={qaBox.resources.length == 0 || !query}
							onClick={sendQuery}
							className={` ${
								qaBox.resources.length && query
									? " text-action hover:bg-primary hover:text-main   active:bg-primary  active:text-white"
									: " text-white"
							}  focus: flex items-center  justify-center py-1 px-2 `}
						>
							<SendHorizonalIcon size={26} />
						</button>
					</div>
				</>
			)}
		</div>
	);
}
