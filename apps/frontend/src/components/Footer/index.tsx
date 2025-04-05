import { CartIconAnim } from "./CartIconAnim";
import { HomeIconAnim } from "./HomeIconAnim";
import { SearchIconAnim } from "./SearchIconAnim";
import { TornadoIconAnim } from "./TornadoIconAnim";
import { UserIconAnim } from "./UserIconAnim";

export default function Footer() {
    return (
        <div className="bg-white fixed w-full h-12 bottom-0 z-10 flex justify-between gap-2 px-4 items-center border-t shadow-xl">
            <TornadoIconAnim className="rounded-4xl" size={22} />
            <SearchIconAnim className="rounded-4xl" size={22} />
            <HomeIconAnim className="rounded-4xl" size={22} />
            <CartIconAnim className="rounded-4xl" size={22} />
            <UserIconAnim className="rounded-4xl" size={22} />
        </div>
    )
}