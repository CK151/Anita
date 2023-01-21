const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const speechBtnDiv = document.querySelector("#speech-btn");
const micBtn = document.querySelector(".btn .fas");
const instructions = document.querySelector(".instructions");

const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const speechSynthesis = window.speechSynthesis;

const recognition = new speechRecognition();

if (speechRecognition && speechSynthesis) {

    console.log("Speech Recognition and Synthesis Supported");

    //mic btn event listener
    micBtn.addEventListener("click", micBtnClicked);

    function micBtnClicked(e) {
        e.preventDefault();
        if (micBtn.classList.contains("fa-microphone")) {
            recognition.start();
        }
        else {
            recognition.stop();
        }
    }

    //start recongnition

    recognition.addEventListener("start", () => {
        micBtn.classList.replace("fa-microphone", "fa-microphone-slash")
        instructions.textContent = "Recording..., Ctrl + K to stop";
        searchInput.focus();
        //console.log("on");

    });

     //stop recongnition

     recognition.addEventListener("end", () => {
        micBtn.classList.add("fa-microphone");
        micBtn.classList.remove("fa-microphone-slash");
        
        instructions.textContent = "Press Ctrl + X or Click the Mic Icon to start recording";
        searchInput.focus();
        //console.log("off");

    });

    recognition.continuous = true;

    const recognitionOn = setInterval(() => {
        if (instructions.textContent.includes("start")) {
            recognition.start();
        }
    }, 3000)
    // Speech Recongnition shortcuts

    speechRecognitionKeys();

    loadTranscripts();

}
else {
    //console.log("Speech Recognition and Synthesis NOT Supported")
    speechBtnDiv.style.display = "none"

}


//recognition shortcuts function


function speechRecognitionKeys() {
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "x") {
            recognition.start();
        }

        if (e.ctrlKey && e.key === "k") {
            recognition.stop();
        }
    });
}

//load Transcripts

function loadTranscripts() {
    recognition.addEventListener("result", (e) => {
        //console.log(e);
        const current = e.resultIndex;
        const transcript = e.results[current][0].transcript;
        showTranscript(transcript);

        //loop through the list array

        for (let i = 0; i < lists.length; i++) {
            let askedQuestion = transcript.toLowerCase().trim();
            
            if (askedQuestion.includes(lists[i].question)) {
                console.log(askedQuestion);
                console.log(lists[i].answer);
                respond(lists[i].answer);
                break;
            }

            if (askedQuestion.startsWith("what is",0) && askedQuestion != lists[i].question && (i = 1)) {
                console.log("No match");
                let errorMsg = "Appologies i do not have enough data to answer this question now."
                respond(errorMsg)
                break;
            }
        }
        
    });
}

//handle response

function respond(res) {
    let voices = window.speechSynthesis.getVoices();
    console.log(voices);
    const speech = new SpeechSynthesisUtterance();
    speech.lang = "en-US";
    speech.text = res;
    speech.volume = "2";
    speech.rate = "0.8";
    speech.pitch = "1";

    if (voices) {
        speech.voice = voices[0]
    }
    else {
        speech.voice = voices[1]
    }
    window.speechSynthesis.speak(speech);

    //speech.voice = speechSynthesis.speak(speech);
}

// show transcript

function showTranscript(transcript) {
    if (transcript.toLowerCase().trim() === "stop recording") {
        recognition.stop();
    }
    else if (!searchInput.value) {
        searchInput.value = transcript;
    }
    else {
        if (transcript.toLowerCase().trim() === "search") {
            searchForm.submit()
        }
        else if (transcript.toLowerCase().trim() === "reset"){
            searchInput.value = "";
        }
        else {
            searchInput.value = transcript;
        }
    }
};