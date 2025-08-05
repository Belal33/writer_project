import { BookUp2, BotIcon, CopyCheck, CopyIcon } from "lucide-react";
import React, {
	KeyboardEvent,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SimpleTooltip } from "../simpleTooltip";
export interface ChatMessageInterface {
	id?: string;
	role: "user" | "assistant" | "system";
	content: string;
	voice_message?: boolean;
	finish_reason?: "stop" | "length" | "content_filter" | null;
	created_at: string;
}

// npm install remark-gfm

export default function AssistantMessage({
	message,
}: {
	message: ChatMessageInterface;
}) {
	const [isCopied, setIsCopied] = useState(false);
	const pRef = useRef<HTMLDivElement>(null);

	const preventScrolling = useCallback((event: KeyboardEvent) => {
		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			event.preventDefault();
		}
	}, []);

	const handelCopyText = useCallback(() => {
		if (pRef.current) {
			navigator.clipboard.writeText(pRef.current.innerText);
		}
	}, []);

	const handelAddToEditor = useCallback(() => {
		// Existing implementation
	}, [message]);

	const MemoizedMessage = useMemo(() => {
		return (
			<Markdown
				remarkPlugins={[remarkGfm]}
				components={
					{
						// Existing implementation
					}
				}
			>
				{message.content}
			</Markdown>
		);
	}, [message]);

	return (
		<>
			{message && (
				<div className="relative w-fit max-w-[85%] md:max-w-[75%] transform transition-all duration-200 ease-out group">
					<div className="absolute -left-2 -top-2">
						<div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
							<BotIcon size={24} className="text-primary dark:text-white" />
						</div>
					</div>
					<div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none px-4 py-2 mt-2 shadow-md hover:shadow-lg transition-shadow">
						<div
							ref={pRef}
							className="prose dark:prose-invert prose-sm md:prose-base max-w-none"
						>
							{MemoizedMessage}
						</div>
						<div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{message.created_at &&
									new Date(message.created_at).toLocaleTimeString()}
							</p>
							<div className="flex gap-2  transition-opacity">
								<SimpleTooltip delay={200} tooltip="Add to editor">
									<button
										onClick={handelAddToEditor}
										onKeyDown={preventScrolling}
										className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
									>
										<BookUp2 size={18} className="text-primary" />
									</button>
								</SimpleTooltip>

								<SimpleTooltip
									delay={0}
									tooltip={isCopied ? "Copied" : "Copy text"}
								>
									<button
										onClick={() => {
											handelCopyText();
											if (!isCopied) {
												setIsCopied(true);
												setTimeout(() => setIsCopied(false), 2000);
											}
										}}
										onKeyDown={preventScrolling}
										className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
									>
										{isCopied ? (
											<CopyCheck size={18} className="text-green-500" />
										) : (
											<CopyIcon size={18} className="text-primary" />
										)}
									</button>
								</SimpleTooltip>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
