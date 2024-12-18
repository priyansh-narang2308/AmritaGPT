import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const ChatInput = () => {
  const [inputValue, setInputValue] = useState(""); // Input value
  const [messages, setMessages] = useState([]); // Chat history
  const [isListening, setIsListening] = useState(false);

  // Microphone click handler
  const handleMicrophoneClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "Speech Recognition is not supported in this browser. Try another browser!"
      );
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prevValue) => `${prevValue} ${transcript}`.trim());
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = (error) => {
        console.error("Speech recognition error:", error);
        setIsListening(false);
      };
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendClick = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: "user" }]);
      setInputValue(""); // Clear the input field
      console.log("Message sent:", inputValue);
    }
  };

  return (
    <div className="flex flex-col h-screen p-3">
      <div className="flex-grow overflow-y-auto flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 m-2 rounded-lg max-w-xs ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-[#A4123F] text-white self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex p-3 items-center justify-between">
        <div
          className={`p-4 rounded-full cursor-pointer ${
            isListening ? "bg-green-500" : "bg-[#A4123F]"
          }`}
          onClick={handleMicrophoneClick}
        >
          <FaMicrophone size={25} color="white" />
        </div>

        <input
          type="text"
          placeholder="Ask me anything about Amrita Vishwa Vidyapeetham!"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full mx-6 py-4 px-6 rounded-lg outline-none text-lg"
        />

        <div
          className="bg-white rounded-xl p-4 cursor-pointer"
          onClick={handleSendClick}
        >
          <IoSend size={25} />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
