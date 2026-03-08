// 채팅 기록을 저장할 배열 (사용자와 GPT의 모든 대화가 여기 저장됨)
let chatHistory = [];

// 메시지 전송 함수
async function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    
    // 입력값이 없으면 함수 종료
    if (userInput === '') return;

    // 채팅 박스를 가져옴
    const chatBox = document.getElementById('chat-box');
    
    // 사용자 메시지를 HTML로 만듦
    const userMessage = `<div class="message"><strong>You:</strong> ${userInput}</div>`;
    
    // 사용자 메시지를 채팅 박스에 추가
    chatBox.innerHTML += userMessage;
    
    // 입력 필드를 비움
    document.getElementById('user-input').value = '';
    
    // 채팅 박스 스크롤을 가장 아래로 이동
    chatBox.scrollTop = chatBox.scrollHeight;

    // 사용자 메시지를 채팅 기록에 추가 (chatHistory에서 GPT가 대화를 기억할 수 있게 함)
    chatHistory.push({ role: 'user', content: userInput });

    try {
        // GPT 응답을 가져옴
        const response = await getGPTResponse();
        
        // GPT 응답을 HTML로 만듦
        const gptMessage = `<div class="message"><strong>GPT:</strong> ${response}</div>`;
        
        // GPT 메시지를 채팅 박스에 추가
        chatBox.innerHTML += gptMessage;
        
        // 채팅 박스 스크롤을 가장 아래로 이동
        chatBox.scrollTop = chatBox.scrollHeight;

        // GPT 응답을 채팅 기록에 추가 (GPT가 이후 대화를 이해할 수 있게 함)
        chatHistory.push({ role: 'assistant', content: response });
    } catch (error) {
        // 오류 메시지를 HTML로 만듦(코드에서 문제가 생겼을 시 확인하기 위함)
        const errorMessage = `<div class="message"><strong>Error:</strong> ${error.message}</div>`;
        
        // 오류 메시지를 채팅 박스에 추가
        chatBox.innerHTML += errorMessage;
        
        // 채팅 박스 스크롤을 가장 아래로 이동
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// GPT 응답을 가져오는 함수
async function getGPTResponse() {
    // OpenAI API 키 
    const apiKey = 'GPT키';
    
    // OpenAI API URL
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    
    // 사용할 모델 
    const model = 'gpt-4';

    try {
        // API 요청을 보냄
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // API 인증
            },
            body: JSON.stringify({
                model: model,                 // 모델 지정
                messages: chatHistory,        // 저장한 채팅 기록 전달 (이 대화 내역으로 GPT가 문맥을 이해)
                max_tokens: 8000,             // 최대 응답 글자 수 제한 
                n: 1,                         // 응답 갯수 (1개)
                stop: null,                   // 응답 중단 조건 (없음)
                temperature: 0.7              // 응답의 창의성 조절(창의성이 클수록 다양한 답변 제공 적을 수록 안정적이고 정확한 답변 제공)
            })
        });

        // 응답 상태가 정상적이지 않으면 오류 처리
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${response.statusText}: ${errorText}`);
        }

        // 응답 데이터를 JSON으로 변환
        const data = await response.json();

        // 응답에 choices가 없거나 길이가 0이면 오류 처리
        if (!data.choices || !data.choices.length) {
            throw new Error('No choices returned from API');
        }

        // 첫 번째 응답 메시지의 내용을 반환
        return data.choices[0].message.content.trim();
    } catch (error) {
        // 오류 발생 시 콘솔에 출력하고 오류 메시지 반환
        console.error('Error fetching GPT response:', error);
        throw new Error(`Failed to fetch GPT response: ${error.message}`);
    }
}

document.getElementById("map-trigger1").onclick = function() {
    document.getElementById("map-container").style.display = "block";
    let images = document.querySelectorAll("#map-container img");
    images[0].src = "images/map1.png";
    images[1].src = "images/catogram1.png";
};

document.getElementById("map-trigger2").onclick = function() {
    document.getElementById("map-container").style.display = "block";
    let images = document.querySelectorAll("#map-container img");
    images[0].src = "images/map2.png";
    images[1].src = "images/catogram2.png"; // 두 번째 이미지 추가
};

document.getElementById("map-trigger3").onclick = function() {
    document.getElementById("map-container").style.display = "block";
    let images = document.querySelectorAll("#map-container img");
    images[0].src = "images/map3.png";
    images[1].src = "images/catogram3.png"; // 두 번째 이미지 추가
};

// X 버튼을 클릭했을 때, 맵 이미지를 숨깁니다.
document.getElementById("close-map-button").onclick = function() {
    document.getElementById("map-container").style.display = "none";
};