"use client";
import PaperSearchResultCard from "./paperSearchResultCard";
import SearchToolPlaceholder from "./searchToolPlaceholder";
import SearchLoaderPage from "./searchLoaderPage";
import { useEffect, useState } from "react";
import sortByRelatedness from "@/utils/sortByRelatedness";
import { PapersSearchData } from "@/rtk/slices/papersSearch";
import { useAppSelector } from "@/rtk/store";

export default function PaperSearchBody() {
	const papersSearchData = useAppSelector((state) => state.papersSearchData);
	const arxivSearchData = useAppSelector((state) => state.arxivSearchData);
	const archiveSearchData = useAppSelector((state) => state.archiveSearchData);
	const synthicalSearchData = useAppSelector(
		(state) => state.synthicalSearchData
	);
	const scopusSearchData = useAppSelector((state) => state.scopusSearchData);
	const EPMCSearchData = useAppSelector((state) => state.EPMCSearchData);

	//  if all search data is init
	if (
		papersSearchData.status === "init" &&
		arxivSearchData.status === "init" &&
		archiveSearchData.status === "init" &&
		synthicalSearchData.status === "init" &&
		scopusSearchData.status === "init" &&
		EPMCSearchData.status === "init"
	)
		return (
			<SearchToolPlaceholder
				icon={
					<div className="text-sm text-mygray flex items-center gap-1 capitalize">
						powered By Arxiv
					</div>
				}
				label="Scientific Paper Search"
				description="Search more than 25 million Scientific Papers!"
			/>
		);

	// if all search data is pending
	if (
		// papersSearchData.status === "pending" &&
		arxivSearchData.status === "pending" &&
		archiveSearchData.status === "pending" &&
		synthicalSearchData.status === "pending" &&
		scopusSearchData.status === "pending" &&
		EPMCSearchData.status === "pending"
	)
		return (
				<SearchLoaderPage />
		);

	return (
		<div className="space-y-8">
			{arxivSearchData.value.length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-mygray mb-4 flex items-center gap-2">
						Results from arXiv
						{arxivSearchData.status === "pending" && (
							<div className="animate-pulse w-2 h-2 rounded-full bg-action"></div>
						)}
					</h3>
					<PaperSearchResults papersSearchData={arxivSearchData} />
				</div>
			)}

			{EPMCSearchData.value.length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-mygray mb-4 flex items-center gap-2">
						Results from Europe PMC
						{EPMCSearchData.status === "pending" && (
							<div className="animate-pulse w-2 h-2 rounded-full bg-action"></div>
						)}
					</h3>
					<PaperSearchResults papersSearchData={EPMCSearchData} />
				</div>
			)}

			{synthicalSearchData.value.length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-mygray mb-4 flex items-center gap-2">
						Results from Synthical
						{synthicalSearchData.status === "pending" && (
							<div className="animate-pulse w-2 h-2 rounded-full bg-action"></div>
						)}
					</h3>
					<PaperSearchResults papersSearchData={synthicalSearchData} />
				</div>
			)}

			{archiveSearchData.value.length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-mygray mb-4 flex items-center gap-2">
						Results from Internet Archive
						{archiveSearchData.status === "pending" && (
							<div className="animate-pulse w-2 h-2 rounded-full bg-action"></div>
						)}
					</h3>
					<PaperSearchResults papersSearchData={archiveSearchData} />
				</div>
			)}

			{scopusSearchData.value.length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-mygray mb-4 flex items-center gap-2">
						Results from Scopus
						{scopusSearchData.status === "pending" && (
							<div className="animate-pulse w-2 h-2 rounded-full bg-action"></div>
						)}
					</h3>
					<PaperSearchResults papersSearchData={scopusSearchData} />
				</div>
			)}

			{/* {papersSearchData.value.length > 0 && (
				<div>
					<h3 className="text-sm font-medium text-mygray mb-4 flex items-center gap-2">
						Additional Results
						{papersSearchData.status === "pending" && (
							<div className="animate-pulse w-2 h-2 rounded-full bg-action"></div>
						)}
					</h3>
					<PaperSearchResults papersSearchData={papersSearchData} />
				</div>
			)} */}
		</div>
	);
}

function PaperSearchResults({
	papersSearchData,
}: {
	papersSearchData: PapersSearchData;
}) {
	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{papersSearchData.value.map((result, i) => {
				return (
					(result.pdfUrl || result.url) && (
						<PaperSearchResultCard
							key={result.url + result.source}
							title={result.title}
							summary={result.summary}
							pdfUrl={result.pdfUrl}
							publisher={result.publisher}
							published={result.published}
							url={result.url}
							identifier={result.identifier}
							source={result.source}
						/>
					)
				);
			})}
		</div>
	);
}
