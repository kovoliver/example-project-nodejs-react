import { useContext } from "react";

import { GlobalContext } from "../App";

export default function Messages() {
    const gc = useContext(GlobalContext);

    const dismiss = (indexToRemove) => {
        gc.setMessages(
            gc.messages.messages.filter((_, i) => i !== indexToRemove),
            gc.messages.msgCls,
            gc.messages.maxWidth
        );
    };

    return (
        <div className={`maxw-${gc.messages.maxWidth} margin-auto`}>
            {gc.messages.messages.map((m, i) => (
                <div
                    key={i}
                    className={`box-${gc.messages.msgCls} p-sm mt-sm mb-sm d-flex jc-space-between radius-md`}
                >
                    <div>{m}</div>

                    <div
                        className="cursor-pointer font-xl dismiss minw-20"
                        onClick={() => dismiss(i)}
                    >
                        &times;
                    </div>
                </div>
            ))}
        </div>
    );
}
