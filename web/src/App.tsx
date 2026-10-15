import { useState } from 'react'

export default function App() {
    const [text, setText] = useState("");
    const [result, setResult] = useState<string[]>([]);
    const [amount, setAmount] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function send(mode: string, amount: number) {
        setError("");
        setLoading(true);
        try{
        const response = await fetch("http://localhost:3001/improve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                mode,
                amount
            })
        });

        let responseJSON;

        try {
            responseJSON = await response.json();
        } catch {
            setResult([]);
            setError("Invalid response from server.");
            return;
        }

        if (!response.ok) {
            setResult([]);
            setError(responseJSON.error || "Something went wrong");
            return;
        }

        setResult(responseJSON.result);

        } catch {
            setResult([]);
            setError("Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='texteditor'>
            <div className='texts'>
                <div className='editor'>
                    <textarea value={text} onChange={(event) => setText(event.target.value)}></textarea>
                </div>

                <div className='variants'>
                    {error && <div>{error}</div>}
                    {result.map((variant, i) => (
                        <div key={i} className='variant'>
                            <div className='variantText'>
                                {variant}
                            </div>
                            <button className='variantButton' onClick={() => setText(variant)}>Übernehmen</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className='toolbar'>
                <div className='toolbarLeft'>
                    <button onClick={() => send("correct", 1)} disabled={text.trim() === "" || loading}>Korrigieren</button>
                    <button onClick={() => send("improve", amount)} disabled={text.trim() === "" || loading}>Sprachliches Verbessern</button>
                    <button onClick={() => send("generate", amount)} disabled={text.trim() === "" || loading}>Text Generieren</button>
                </div>

                <div className='toolbarRight'>
                    Anzahl an Vorschlägen:&nbsp;&nbsp;&nbsp;
                    <select value={amount} onChange={(e) => setAmount(Number(e.target.value))}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
