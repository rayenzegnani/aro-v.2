import { useState } from 'react';

const AIModel = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Ajouter le message de l'utilisateur
    const userMessage = { id: messages.length + 1, text: inputValue, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simuler une réponse de l'IA après un délai
    setTimeout(() => {
      const aiMessage = { 
        id: messages.length + 2, 
        text: `Je réfléchis à votre question : "${inputValue}". Ceci est une réponse simulée.`, 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* En-tête */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center mr-3">
            <span className="text-xl">AI</span>
          </div>
          <h1 className="text-xl font-bold">Assistant IA</h1>
        </div>
      </header>

      {/* Zone de conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="container mx-auto flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tapez votre message..."
            className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModel;