import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react"; // TinyMCE editor
function App() {
    const [document, setDocument] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket("ws://localhost:5000");
        setSocket(newSocket);

        newSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "update") {
                setDocument(message.data);
            }
        };

        return () => newSocket.close();
    }, []);

    const handleEditorChange = (content) => {
        setDocument(content);
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "update", data: content }));
        }
    };

    return (
        <div className="container min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-10">
            {/* Navbar */}
            <header className="w-full max-w-4xl flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
                <h1 className="text-2xl font-bold text-teal-800">📝 Live Collaborative Editor</h1>
            </header>

            {/* Editor Container */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-6">
                <Editor
                    apiKey="8kgvgyhuyd8jpve4ayz47q6t83h36tyee5u7ydf7k87vehcl" // 🔹 Your API key
                    value={document}
                    onEditorChange={handleEditorChange}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            "advlist", "autolink", "lists", "link", "image", "charmap",
                            "preview", "anchor", "searchreplace", "visualblocks",
                            "code", "fullscreen", "insertdatetime", "media", "table",
                            "paste", "help", "wordcount"
                        ],
                        toolbar:
                            "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | " +
                            "bullist numlist outdent indent | removeformat | help",
                        external_plugins: {
                            print: "https://cdn.tiny.cloud/1/no-api-key/tinymce/6/plugins/print/plugin.min.js",
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default App;
