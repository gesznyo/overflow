import {Card, Chip} from "@heroui/react";
import Link from "next/link";
import {Tag} from "@/lib/types";

type Props = {
    tag: Tag
}

export default function TagCard({tag}: Props) {
    return (
        <Link href={`/questions?tag=${tag.slug}`}>
            <Card>
                <Card.Header>
                    <Card.Title>
                        <Chip variant={'soft'}>{tag.slug}</Chip>
                    </Card.Title>
                    <Card.Description className={'line-clamp-3'}>
                        {tag.description}
                    </Card.Description>
                    <Card.Footer>
                        42 questions
                    </Card.Footer>
                </Card.Header>
            </Card>
        </Link>
    );
}
