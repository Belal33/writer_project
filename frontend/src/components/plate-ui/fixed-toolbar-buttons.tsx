import React from "react";
import {
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { useEditorReadOnly } from "@udecode/plate/react";
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
} from "@udecode/plate-font/react";
import {
	AudioPlugin,
	FilePlugin,
	ImagePlugin,
	// MediaEmbedPlugin,
	VideoPlugin,
} from "@udecode/plate-media/react";

import { Icons } from "@/components/icons";
import { AlignDropdownMenu } from "@/components/plate-ui/align-dropdown-menu";
import { EmojiDropdownMenu } from "@/components/plate-ui/emoji-dropdown-menu";
import {
	BulletedIndentListToolbarButton,
	NumberedIndentListToolbarButton,
} from "@/components/plate-ui/indent-list-toolbar-button";
import { IndentToolbarButton } from "@/components/plate-ui/indent-toolbar-button";

import { LineHeightDropdownMenu } from "@/components/plate-ui/line-height-dropdown-menu";
import { LinkToolbarButton } from "@/components/plate-ui/link-toolbar-button";
import { MediaToolbarButton } from "@/components/plate-ui/media-toolbar-button";
import { MoreDropdownMenu } from "@/components/plate-ui/more-dropdown-menu";
import { OutdentToolbarButton } from "@/components/plate-ui/outdent-toolbar-button";
import { TableDropdownMenu } from "@/components/plate-ui/table-dropdown-menu";

import { ColorDropdownMenu } from "./color-dropdown-menu";
import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ModeDropdownMenu } from "./mode-dropdown-menu";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";
import { CodeBlockToolbarButton } from "./code-bock-button";
import { ExportToolbarButton } from "./export-toolbar-button";
import {
	ArrowUpToLineIcon,
	BaselineIcon,
	Code2Icon,
	HighlighterIcon,
	PaintBucketIcon,
} from "lucide-react";
import { RedoToolbarButton, UndoToolbarButton } from "./history-toolbar-button";
import { FontSizeToolbarButton } from "./font-size-toolbar-button";
import { IndentTodoToolbarButton } from "./indent-todo-toolbar-button";
import { ToggleToolbarButton } from "./toggle-toolbar-button";
import { TodoListToolbarButton } from "./todo-list-toolbar-button";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { ListToolbarButton } from "./list-toolbar-button";
import {
	BulletedListPlugin,
	NumberedListPlugin,
	TodoListPlugin,
} from "@udecode/plate-list/react";
import { ImportToolbarButton } from "./import-toolbar-button";

// https://github.com/udecode/plate-playground-template/blob/main/src/components/plate-ui/fixed-toolbar-buttons.tsxhttps://github.com/udecode/plate-playground-template/blob/main/src/components/plate-ui/fixed-toolbar-buttons.tsx
export function FixedToolbarButtons() {
	const readOnly = useEditorReadOnly();

	return (
		<div className="w-full overflow-hidden overflow-x-auto p-1 ">
			<div
				className="flex justify-between "
				style={{
					transform: "translateX(calc(-1px))",
				}}
			>
				{!readOnly && (
					<>
						<ToolbarGroup>
							<UndoToolbarButton />
							<RedoToolbarButton />
						</ToolbarGroup>

						<ToolbarGroup>
							<ExportToolbarButton>
								<ArrowUpToLineIcon />
							</ExportToolbarButton>
							<ImportToolbarButton />
						</ToolbarGroup>

						<ToolbarGroup>
							<InsertDropdownMenu />
							<TurnIntoDropdownMenu />
							<FontSizeToolbarButton />
						</ToolbarGroup>

						<ToolbarGroup>
							<MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
								<Icons.bold />
							</MarkToolbarButton>
							<MarkToolbarButton
								nodeType={ItalicPlugin.key}
								tooltip="Italic (⌘+I)"
							>
								<Icons.italic />
							</MarkToolbarButton>
							<MarkToolbarButton
								nodeType={UnderlinePlugin.key}
								tooltip="Underline (⌘+U)"
							>
								<Icons.underline />
							</MarkToolbarButton>

							<MarkToolbarButton
								nodeType={StrikethroughPlugin.key}
								tooltip="Strikethrough (⌘+⇧+M)"
							>
								<Icons.strikethrough />
							</MarkToolbarButton>
							<MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
								<Code2Icon />
							</MarkToolbarButton>
							{/* color */}
							<ColorDropdownMenu
								nodeType={FontColorPlugin.key}
								tooltip="Text color"
							>
								<BaselineIcon />
							</ColorDropdownMenu>
							<ColorDropdownMenu
								nodeType={FontBackgroundColorPlugin.key}
								tooltip="Background color"
							>
								<PaintBucketIcon />
							</ColorDropdownMenu>
						</ToolbarGroup>

						<ToolbarGroup>
							<AlignDropdownMenu />

							<NumberedIndentListToolbarButton />
							<BulletedIndentListToolbarButton />
							<IndentTodoToolbarButton />
							<ToggleToolbarButton />
						</ToolbarGroup>

						{/* <ToolbarGroup>
							<AlignDropdownMenu />
							<ListToolbarButton nodeType={BulletedListPlugin.key} />
							<ListToolbarButton nodeType={NumberedListPlugin.key} />
							<ListToolbarButton nodeType={TodoListPlugin.key} />
							<ToggleToolbarButton />
						</ToolbarGroup> */}

						{/* <ToolbarGroup>
							<IndentListToolbarButton nodeType={ListStyleType.Disc} />
							<IndentListToolbarButton nodeType={ListStyleType.Decimal} />

						</ToolbarGroup> */}

						<ToolbarGroup>
							<LineHeightDropdownMenu />
							<OutdentToolbarButton />
							<IndentToolbarButton />
						</ToolbarGroup>

						<ToolbarGroup>
							<CodeBlockToolbarButton />
							<LinkToolbarButton />
							<TableDropdownMenu />
							<EmojiDropdownMenu />
						</ToolbarGroup>

						<ToolbarGroup>
							<MediaToolbarButton nodeType={ImagePlugin.key} />
							<MediaToolbarButton nodeType={VideoPlugin.key} />
							<MediaToolbarButton nodeType={AudioPlugin.key} />
							<MediaToolbarButton nodeType={FilePlugin.key} />
						</ToolbarGroup>

						<ToolbarGroup>
							<MoreDropdownMenu />
						</ToolbarGroup>
					</>
				)}

				<div className="grow" />
				<ToolbarGroup>
					<MarkToolbarButton nodeType={HighlightPlugin.key} tooltip="Highlight">
						<HighlighterIcon />
					</MarkToolbarButton>
					{/* <CommentToolbarButton /> */}
				</ToolbarGroup>

				<ToolbarGroup>
					<ModeDropdownMenu />
				</ToolbarGroup>
			</div>
		</div>
	);
}
