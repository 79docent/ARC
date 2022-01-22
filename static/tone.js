console.clear();

// wczytywanie pliku .txt

let input = document.querySelector('input');
let textarea = document.querySelector('textarea');
textarea.readOnly = true; // blokowanie textarea 
input.addEventListener('change', () => {
    let files = input.files;
    if(files.length == 0) return;
    const file = files[0];
    let reader = new FileReader();


    reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/);
        text = file;
        textarea.value = lines.join('\n');
        Play(text)

    };
    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(file);

});

// odtwarzanie nut

function Play(text) {
var started = false;
document.getElementById("play_button").addEventListener("click", () => {
  if (started) return;
  started = true;
  const audio = document.querySelector('audio');
  const synth = new Tone.Synth();
  const actx = Tone.context;
  const dest = actx.createMediaStreamDestination();
  const recorder = new MediaRecorder(dest.stream);

  synth.connect(dest);
  synth.toMaster();

  const chunks = [];

  const notes = text.split('').map(n => `${n}4`);
  let note = 0;
  Tone.Transport.scheduleRepeat(time => {
    if (note === 0 && recorder.state == "inactive") recorder.start();
    if (note > notes.length) {
      synth.triggerRelease(time);
      console.log("recorder stopped, data available");     
    } else synth.triggerAttack(notes[note], time);
    note++;
  }, '4n');

  document.getElementById("stop_button").addEventListener("click", () => {
    if (recorder.state == "recording"){
      console.log("jest record");
      recorder.stop();
      Tone.Transport.stop();
    }
  });


  recorder.ondataavailable = evt => chunks.push(evt.data);
  recorder.onstop = evt => {
    let blob = new Blob(chunks, { type: 'audio/mp3; codecs=opus' });
    audio.src = URL.createObjectURL(blob);
  };

  Tone.Transport.start();
});

}

