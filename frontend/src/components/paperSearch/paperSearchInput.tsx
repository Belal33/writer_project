"use client";
import { getArchiveSearch } from "@/rtk/slices/articleResources/archiveSearch";
import { getArxivSearch } from "@/rtk/slices/articleResources/arxivSearch";
import { getEPMCSearch } from "@/rtk/slices/articleResources/EPMCSearch";
import { getScopusSearch } from "@/rtk/slices/articleResources/scopusSearch";
import { getSynthicalSearch } from "@/rtk/slices/articleResources/synthicalSearch";
import { searchAboutPapers } from "@/rtk/slices/papersSearch";
import { useAppDispatch } from "@/rtk/store";
import { SearchIcon } from "lucide-react";
import React, { KeyboardEvent } from "react";

export default function PaperSearchInput() {
	const [inputValue, changeInputValue] = React.useState("");
	const dispatch = useAppDispatch();

	const searchHandler = (inputValue: string) => {
		// dispatch(searchAboutPapers({ query: inputValue.trim(), maxResults: 10 }));
		dispatch(getArxivSearch({ query: inputValue.trim(), maxResults: 10 }));
		dispatch(getScopusSearch({ query: inputValue.trim(), maxResults: 10 }));
		dispatch(getEPMCSearch({ query: inputValue.trim(), maxResults: 10 }));
		dispatch(getSynthicalSearch({ query: inputValue.trim(), maxResults: 10 }));
		dispatch(getArchiveSearch({ query: inputValue.trim(), maxResults: 10 }));

	};

	const inputHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (inputValue.trim()) {
				searchHandler(inputValue);
				changeInputValue("");
			}
		}
	};

	return (
		<div className="relative">
			<SearchIcon
				className="absolute left-4 top-1/2 -translate-y-1/2 text-action"
				size={18}
			/>
			<input
				type="text"
				name="search"
				value={inputValue}
				onChange={(e) => changeInputValue(e.target.value)}
				onKeyDown={inputHandler}
				placeholder="Search for academic papers and resources..."
				className="w-full h-11 pl-11 pr-4 text-primary bg-main border border-action/20 
				rounded-lg placeholder:text-mygray focus:outline-none focus:border-action 
				focus:ring-1 focus:ring-action transition-shadow"
				autoComplete="off"
			/>
		</div>
	);
}
