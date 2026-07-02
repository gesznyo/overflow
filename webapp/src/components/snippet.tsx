"use client";

import { Button, Tooltip } from "@heroui/react";
import { useState, ReactNode } from "react";

// Optional: If you use a utility like tailwind-merge or clsx, you can swap this out.
const cn = (...classes: (string | boolean | null | undefined)[]) => classes.filter(Boolean).join(" ");

interface SnippetProps {
    children: string | string[];
    symbol?: string | ReactNode;
    variant?: "flat" | "bordered";
    color?: "default" | "primary" | "success" | "warning" | "danger" | "accent";
    hideSymbol?: boolean;
    hideCopyButton?: boolean;
    className?: string;
}

export function Snippet({
                            children,
                            symbol = ">",
                            variant = "flat",
                            color = "default",
                            hideSymbol = false,
                            hideCopyButton = false,
                            className,
                        }: SnippetProps) {
    const [copied, setCopied] = useState(false);

    const isMultiLine = Array.isArray(children);
    const lines = isMultiLine ? children : [children as string];
    const codeString = lines.join("\n");

    const handleCopy = async () => {
        if (!navigator?.clipboard) return;
        try {
            await navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const symbolElement = !hideSymbol && (
        <span className="select-none text-default-500 mr-2">{symbol}</span>
    );

    // You can expand these to match your exact Tailwind theme tokens
    const variantStyles = {
        flat: "bg-default border-transparent text-default-foreground",
        bordered: "border-default rounded-xl",
    };

    const colorStyles = {
        default: "",
        primary: "bg-primary/25 border-primary/50 text-primary",
        success: "bg-success/25 border-success/50 text-success",
        warning: "bg-warning/25 border-warning/50 text-warning",
        danger: "bg-danger/25 border-danger/50 text-danger",
        accent: "bg-accent/25 border-accent/50 text-accent",
    };



    return (
        <div
            className={cn(
                "flex items-start justify-between gap-4 font-mono text-sm rounded-lg p-3 border",
                variantStyles[variant],
                color !== "default" && colorStyles[color],
                className
            )}
        >
            <div className="flex-1 min-w-0 overflow-x-auto">
                {isMultiLine ? (
                    <div className="space-y-1">
                        {lines.map((line, index) => (
                            <pre key={index} className="m-0 bg-transparent p-0 text-inherit font-inherit">
                {symbolElement}
                                {line}
              </pre>
                        ))}
                    </div>
                ) : (
                    <pre className="m-0 bg-transparent p-0 text-inherit font-inherit whitespace-pre-wrap wrap-break-word">
            {symbolElement}
                        {children}
          </pre>
                )}
            </div>

            {!hideCopyButton && (
                <Tooltip closeDelay={0}>
                    <Tooltip.Trigger>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            onPress={handleCopy}
                            aria-label="Copy code"
                            className="text-inherit opacity-70 hover:opacity-100 transition-opacity"
                        >
                            {copied ? (
                                // Check Icon
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                                // Copy Icon
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            )}
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        {copied ? "Copied!" : "Copy to clipboard"}
                    </Tooltip.Content>
                </Tooltip>
            )}
        </div>
    );
}