import { MenuIcon } from "./MenuIcon";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
    return (
        <header>
            <div className="flex justify-between px-4 items-center h-16">
                <h1 className="text-3xl font-bold">Wingfi India</h1>
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon size={38} />
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                            <SheetDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}