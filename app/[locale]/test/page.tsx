"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import {
	Button,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	Select,
	SelectValue,
} from "react-aria-components";

function range(len: number) {
	return Array.from(Array(len).keys());
}

export default function TestPage() {
	return (
		<main
			style={{
				alignContent: "start",
				display: "grid",
				gap: 32,
				marginInline: "auto",
				maxWidth: 1024,
				padding: 32,
				width: "100%",
			}}
		>
			{range(24).map((id) => {
				return (
					<Select key={id} defaultSelectedKey={"10"} style={{ display: "grid", gap: 6 }}>
						<Label>{`Test ${String(id)}`}</Label>
						<Button
							style={{
								alignItems: "center",
								background: "white",
								border: "1px solid black",
								borderRadius: 4,
								color: "black",
								display: "flex",
								gap: 16,
								justifyContent: "space-between",
								padding: "6px 10px 6px 12px",
								userSelect: "none",
								whiteSpace: "nowrap",
								width: "100%",
							}}
						>
							<SelectValue />
							<ChevronsUpDownIcon
								aria-hidden={true}
								style={{
									flexShrink: 0,
									height: 16,
									width: 16,
								}}
							/>
						</Button>
						<Popover style={{ minWidth: "var(--trigger-width)" }}>
							<ListBox
								style={{
									background: "white",
									border: "1px solid black",
									borderRadius: 4,
									color: "black",
									maxHeight: 320,
									overflow: "auto",
									padding: 4,
									userSelect: "none",
								}}
							>
								{range(12).map((id) => {
									return (
										<ListBoxItem key={id} id={String(id)} textValue={String(id)}>
											{({ isSelected }) => {
												return <span style={{ fontWeight: isSelected ? 700 : 400 }}>{id}</span>;
											}}
										</ListBoxItem>
									);
								})}
							</ListBox>
						</Popover>
					</Select>
				);
			})}
		</main>
	);
}
