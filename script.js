window.onload = function() {
    if(localStorage.getItem('grok_key')) document.getElementById('grokKey').value = localStorage.getItem('grok_key');
    if(localStorage.getItem('sup_url')) document.getElementById('supabaseUrl').value = localStorage.getItem('sup_url');
    if(localStorage.getItem('sup_key')) document.getElementById('supabaseKey').value = localStorage.getItem('sup_key');
};

function saveSettings() {
    const grokKey = document.getElementById('grokKey').value;
    const supUrl = document.getElementById('supabaseUrl').value;
    const supKey = document.getElementById('supabaseKey').value;
    
    localStorage.setItem('grok_key', grokKey);
    localStorage.setItem('sup_url', supUrl);
    localStorage.setItem('sup_key', supKey);
    
    alert("Configurations saved successfully!");
}

async function generateCodeWithGrok() {
    const apiKey = localStorage.getItem('grok_key') || document.getElementById('grokKey').value;
    const supUrl = localStorage.getItem('sup_url') || document.getElementById('supabaseUrl').value;
    const supKey = localStorage.getItem('sup_key') || document.getElementById('supabaseKey').value;
    
    const promptText = document.getElementById('aiPrompt').value;
    const codeArea = document.getElementById('masterCode');
    const resultDiv = document.getElementById('result');
    
    if(!apiKey) {
        alert("Please enter and save your Grok API Key first!");
        return;
    }
    if(!promptText) {
        alert("Please enter an app idea/prompt!");
        return;
    }
    
    resultDiv.innerHTML = "Grok is writing your single-file code...";
    
    const fullPrompt = `Create a complete, single-file mobile web app based on this request: '${promptText}'. 
    If database is needed, use these Supabase credentials config: URL: ${supUrl}, Key: ${supKey}. 
    Output ONLY valid HTML code including internal <style> and <script> tags. Do not use markdown blocks.`;

    try {
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "grok-beta",
                messages: [{ role: "user", content: fullPrompt }]
            })
        });
        
        const data = await response.json();
        let code = data.choices[0].message.content;
        
        code = code.replace(/```html/g, "").replace(/```/g, "").trim();
        
        codeArea.value = code;
        resultDiv.innerHTML = "<p style='color: #4ade80;'>Code generated successfully via Grok!</p>";
    } catch (error) {
        resultDiv.innerHTML = `<p style='color: #f87171;'>Error: ${error.message}</p>`;
    }
}

function downloadSingleFileApp() {
    const code = document.getElementById('masterCode').value;
    if(!code) {
        alert("No code to download!");
        return;
    }
    
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Viziahub_App.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
