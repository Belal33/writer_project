"use client";

import { soketUrl } from "@/baseApis/base";
import ChatBody from "@/components/chat/ChatBody";
import ChatInput from "@/components/chat/ChatInput";
import MessagesProvider from "@/components/chat/MessagesProvider";
import WritingToolsBar from "@/components/functionBar/writtingToolsBar/writtingToolsBar";
import { QABoxAnswerInterface } from "@/endpointActions/postCreateAnswerBoxAction";
import { useAppSelector } from "@/rtk/store";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import CustomExcalidraw from "./lasyExcalidraw";
import { Qabox } from "./qabox";
import ResourcesTool from "./resourcesTool";
import QABoxUploadResource from "../qabox/qaboxUploadResource";

export default function FuctionBar() {
	const ref = useRef<HTMLDivElement>(null);
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const isActiveResources = useAppSelector((state) => state.isActiveResources);
	const [qaResults, setQAResults] = useState<QABoxAnswerInterface[]>([]);
	const currentTool = useAppSelector((state) => state.projectOpenedTool);
	const { sendJsonMessage, lastJsonMessage } = useWebSocket<{
		content: string;
		finish_reason: "stop" | "length" | "content_filter" | null;
	}>(`${soketUrl}chat/${currentUserProject.value.chatbox}`, {
		onOpen: () => console.log("opened"),
		shouldReconnect: (closeEvent) =>
			currentUserProject.value.chatbox?.length > 0,
	});

	useEffect(() => {
		if (ref.current) ref.current?.scrollTo(0, ref.current.scrollHeight);
	}, [currentTool]);

	return (
		<MessagesProvider>
			<div
				style={{ height: !currentTool.id ? "0%" : "100%" }}
				className={`
							transition-all ease-in-out duration-500 
							w-full absolute border-t border-gray-200 bottom-0 z-[222] 
							bg-white shadow-2xl rounded-t-xl 
							flex flex-col
          			${!currentTool.id ? "translate-y-full" : "translate-y-0"}
        		`}
			>
				<WritingToolsBar />

				{/* Main Content Area */}
				<div className="flex-1 overflow-hidden relative">
					{/* Chat Tool */}
					{currentTool.id === 1 && (
						<div className="h-full flex flex-col">
							<div className="flex-1 overflow-y-auto px-4">
								<div className=" max-w-7xl h-full mx-auto">
									<ChatBody body={ref} lastSocketMessage={lastJsonMessage} />
								</div>
							</div>

							{/* QA Results Section */}
							<Qabox qaResults={qaResults} />
						</div>
					)}

					{/* Paper Search Tool */}
					{currentTool.id === 2 && <ResourcesTool />}

					{currentTool.id === 3 && (
						<div className="h-full w-full max-w-5xl mx-auto px-4 py-6">
							{/* QA Box Resources Section */}
							{currentUserProject.value.qaBox && (
								<div className="bg-white  rounded-lg shadow-sm border border-action/10 overflow-hidden">
									<QABoxUploadResource
										qaBoxId={currentUserProject.value.qaBox}
									/>
								</div>
							)}
						</div>
					)}
					{/* Excalidraw Tool */}
					{currentTool.id === 4 && (
						<div className="h-full w-full">
							<CustomExcalidraw />
						</div>
					)}
				</div>

				{/* Chat Input - Always present except for Excalidraw */}
				{currentTool.id !== 4 && (
					<div className="w-full border-t border-gray-200 bg-white">
						<div className="max-w-5xl mx-auto px-4">
							<ChatInput
								chatId={currentUserProject.value.chatbox}
								sendSocketMesssage={sendJsonMessage}
								setQAResults={isActiveResources ? setQAResults : undefined}
								qaResults={qaResults}
							/>
						</div>
					</div>
				)}
			</div>
		</MessagesProvider>
	);
}
