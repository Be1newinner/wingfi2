import { Cross } from "lucide-react";
import { MenuIcon } from "./MenuIcon";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
    return (
        <header className="bg-white border-b-2 fixed top-0 w-full z-50">
            <div className="flex justify-between px-4 items-center h-16">
                <h1 className="text-2xl font-bold">Wingfi India</h1>
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon size={30} className="rounded-4xl" />
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold">
                                <span className="text-xl font-bold">
                                    Wingfi India
                                </span>
                            </SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </header >
    )
}