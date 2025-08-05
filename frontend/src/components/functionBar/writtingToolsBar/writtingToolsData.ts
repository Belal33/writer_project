import {
	BotIcon,
	EditIcon,
	FilePlus2Icon,
	FileQuestionIcon,
	PaintBucketIcon,
} from "lucide-react";

export interface WritingTool {
	id: number;
	name: string;
	description: string;
	Icon: any;
	category: "editor" | "ai" | "resources";
	shortcut?: string;
}

const writtingToolsData: WritingTool[] = [
	{
		id: 0,
		name: "Editor",
		description: "Smart text editor with AI assistance",
		Icon: EditIcon,
		category: "editor",
		shortcut: "Ctrl+E",
	},
	{
		id: 1,
		name: "AI Chat",
		description: "Interact with advanced AI models",
		Icon: BotIcon,
		category: "ai",
		shortcut: "Ctrl+I",
	},
	{
		id: 2,
		name: "Resources",
		description: "Search and manage research papers",
		Icon: FileQuestionIcon,
		category: "resources",
		shortcut: "Ctrl+R",
	},
	{
		id: 3,
		name: "Q&A",
		description: "Find answers in your resources",
		Icon: FilePlus2Icon,
		category: "resources",
		shortcut: "Ctrl+Q",
	},
	{
		id: 4,
		name: "ExaliDrawer",
		description: "Explain your thoughts in a visual way",
		Icon: PaintBucketIcon,
		category: "resources",
		shortcut: "Ctrl+X",
	},
];

export default writtingToolsData;
