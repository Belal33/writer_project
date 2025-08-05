"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@udecode/cn";
import { ParagraphPlugin, Plate, TPlateEditor } from "@udecode/plate/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import buildEditor from "./editorBuilder";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { updateUserProject } from "@/rtk/slices/currentUserProject";
import CompletionPopover from "./completion/completionPopover";
import { setprojectOpenedToolId } from "@/rtk/slices/projectOpenedTool";

const initialvalue = [
	{
		id: "1",
		type: ParagraphPlugin.key,
		children: [{ text: "" }],
	},
];

	let timer: NodeJS.Timeout;
	let timer1: NodeJS.Timeout;
export default function MainEditor({ className }: { className?: string }) {
	const [rewritePopoverVisibility, setRewritePopoverVisibility] =
		useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const appDispatch = useAppDispatch();
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const currentTool = useAppSelector((state) => state.projectOpenedTool);
	const editor = useMemo(() => {
		return buildEditor(currentUserProject.value.article || initialvalue);
	}, []);

	const saveArticle = useCallback(() => {
		appDispatch(
			updateUserProject({
				projectBody: editor.children,
				projectId: currentUserProject.value.id,
			})
		);
	}, []);


	return (
		<div
			className={`h-full w-full transition-all duration-300 bg-gradient-to-br from-main via-white to-main ${className}`}
		>
			<DndProvider backend={HTML5Backend}>
				<TooltipProvider>
					<Plate
						onChange={(e) => {
							if (rewritePopoverVisibility) setRewritePopoverVisibility(false);
							if (timer1) clearTimeout(timer1);
							timer1 = setTimeout(() => {
								setRewritePopoverVisibility(true);
							}, 1000);
						}}
						onValueChange={(e) => {
							if (timer) clearTimeout(timer);
							timer = setTimeout(() => {
								if (currentUserProject.value.id) saveArticle();
							}, 1000);
						}}
						editor={editor}
					>
						{" "}
						<div
							ref={containerRef}
							className={cn(
								"relative flex flex-col h-full bg-gradient-to-br from-main via-white to-main",
								"[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4"
							)}
						>
							<FixedToolbar className="backdrop-blur-lg bg-main border-b border-action/10 shadow-[0_2px_15px_rgba(169,33,53,0.1)] z-50 transition-all duration-300">
								<FixedToolbarButtons />
							</FixedToolbar>
							<div className="flex-1 overflow-auto ">
								<div className="max-w-5xl mx-auto ">
									<Editor
										className="p-8 md:p-12 min-h-full  backdrop-blur-sm shadow-[0_0_20px_rgba(169,33,53,0.1)] rounded-sm my-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(169,33,53,0.2)] hover:border-action/20 border border-action/10"
										focusRing={false}
										variant="ghost"
										onFocus={() =>
											currentTool.id && appDispatch(setprojectOpenedToolId(0))
										}
										size="md"
									>
										{rewritePopoverVisibility && editor.api.isFocused() && (
											<CompletionPopover />
										)}
									</Editor>
								</div>
							</div>
						</div>
					</Plate>
				</TooltipProvider>
			</DndProvider>
		</div>
	);
}
