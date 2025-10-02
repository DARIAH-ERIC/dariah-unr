"use client";

import { type AsyncListData, useAsyncList } from "@react-stately/data";
import type { Key, Selection } from "@react-types/shared";
import { CameraIcon } from "lucide-react";
import { Fragment, type ReactNode, useCallback, useState } from "react";
import { ListBox, ListBoxItem } from "react-aria-components";

import { UploadImageForm } from "@/components/ui/blocks/upload-image-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogCancelButton,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Label } from "@/components/ui/label";
import { Modal, ModalOverlay } from "@/components/ui/modal";
import { getImageUrls } from "@/lib/actions/images";
import { cn } from "@/lib/styles";

interface ImageSelectorProps {
	defaultValue: string | undefined;
	name: string;
}

export function ImageSelector(props: ImageSelectorProps): ReactNode {
	const { defaultValue, name } = props;

	const [imageUrl, setImageUrl] = useState(defaultValue);

	return (
		<div className="group grid content-start gap-y-1.5">
			<Label>Logo</Label>
			{imageUrl ? (
				<figure className="w-1/2">
					{
						// eslint-disable-next-line @next/next/no-img-element
						<img alt="" src={imageUrl} />
					}
				</figure>
			) : undefined}
			<input name={name} type="hidden" value={imageUrl} />
			<DialogTrigger>
				<IconButton variant="outline">
					<CameraIcon aria-hidden={true} className="size-5 shrink-0" />
					<span className="sr-only">select logo</span>
				</IconButton>
				<ImageDialog handleUpdate={setImageUrl} />
			</DialogTrigger>
		</div>
	);
}

interface ImagesDialogProps {
	handleUpdate: (value: string) => void;
}

export function ImageDialog(props: ImagesDialogProps): ReactNode {
	const { handleUpdate } = props;

	const [selectedImage, setSelectedImage] = useState<Key | null>(null);

	const imagesList = useAsyncList<{ objectName: string } & { url: string }>({
		async load(_signal) {
			const data = await getImageUrls();
			return { items: data };
		},
		getKey: (item) => {
			return item.objectName;
		},
	});

	const onSelectionChange = (keys: Selection) => {
		const image = Array.from(keys)[0] ?? null;
		if (image === "all") {
			setSelectedImage(null);
		} else {
			setSelectedImage(image);
		}
	};

	const handleUploadSuccess = useCallback(() => {
		imagesList.reload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ModalOverlay>
			<Modal isDismissable={true}>
				<Dialog>
					{({ close }) => {
						const update = () => {
							if (selectedImage) {
								handleUpdate(selectedImage.toString());
							}
							close();
						};

						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Choose Image</DialogTitle>
								</DialogHeader>
								<UploadImageForm onUploadSuccess={handleUploadSuccess} />
								<ImageGrid imagesList={imagesList} onSelectionChange={onSelectionChange} />
								<DialogFooter>
									<DialogCancelButton>Cancel</DialogCancelButton>
									<Button onPress={update}>Update</Button>
								</DialogFooter>
							</Fragment>
						);
					}}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}

interface ImageGridProps {
	onSelectionChange: (key: Selection) => void;
	imagesList: AsyncListData<{ objectName: string; url: string }>;
}

export function ImageGrid(props: ImageGridProps): ReactNode {
	const { imagesList, onSelectionChange } = props;

	return (
		<ListBox
			aria-label="Logo Images"
			className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-8"
			items={imagesList.items}
			layout="grid"
			onSelectionChange={onSelectionChange}
			selectionMode="single"
		>
			{(item) => {
				const { objectName, url } = item;
				return (
					<ListBoxItem id={url}>
						{({ isSelected }) => {
							return (
								<figure
									className={cn(
										"grid grid-rows-[12rem_auto] gap-y-2",
										isSelected ? "ring-4" : undefined,
									)}
								>
									{/* FIXME: add a custom loader for `next/image` if possible, otherwise create our own wrapper which generates a `srcset`. */}
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										alt=""
										className={cn("size-full object-cover", isSelected ? undefined : "border")}
										src={url}
									/>
									<figcaption className="truncate">{objectName}</figcaption>
								</figure>
							);
						}}
					</ListBoxItem>
				);
			}}
		</ListBox>
	);
}
