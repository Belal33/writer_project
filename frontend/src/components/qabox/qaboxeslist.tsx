"use client";
import MainTitle from "@/components/mainTitle";
import useUserQaBoxesFetcher from "@/swrDataFetcher/userQaBoxesFetcher";
import Link from "next/link";
import CreateQAboxModal from "../customModal/creatQAboxModal";
import pagePaths from "@/urlPaths/pagePaths";

export default function QABoxesList() {
	const { qaBoxes, isLoading } = useUserQaBoxesFetcher();
	return (
		<div>
			<div className="flex justify-between gap-12 max-w-[600px] px-4 items-end  mx-auto mb-10">
				<MainTitle title="QA Boxes" />
				<CreateQAboxModal />
			</div>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div className="container mx-auto">
					{qaBoxes.map((qaBox) => (
						<div
							className="p-2 m-4 border-4 border-primary bg-main rounded"
							key={qaBox.id}
						>
							<Link
								href={`${pagePaths.qaBoxPage}/${qaBox.id}`}
								key={qaBox.id}
								className="block text-xl"
							>
								{qaBox.name}| {qaBox.id}
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
