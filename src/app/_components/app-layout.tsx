import { type PropsWithChildren } from "react";


export function UserNav() {
    return (
        <span>Avatar</span>
    )
}


export default function AppLayout({ children }: PropsWithChildren) {

    return (
        <div className="flex flex-col min-h-screen">
            <div className="border-b">
                <div className="flex justify-center">
                    <div className="border-x max-w-screen-2xl w-full">
                        <div className="h-16">
                            <UserNav />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 h-full flex justify-center">
                <div className="max-w-screen-2xl border-x w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}