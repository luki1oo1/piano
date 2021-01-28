const time = 3.88;
const soundsTable = document.querySelector('.sounds-table tbody');
const buttonsContainer = document.querySelector('.buttons-container');
const pianoKeys = [
    {
        key: 'c1',
        mp3: 'c.mp3'
    },
    {
        key: 'd1',
        mp3: 'd.mp3'
    },
    {
        key: 'e1',
        mp3: 'e.mp3'
    },
    {
        key: 'f1',
        mp3: 'f.mp3'
    },
    {
        key: 'g1',
        mp3: 'g.wav'
    },
    {
        key: 'a1',
        mp3: 'a.mp3'
    },
    {
        key: 'b1',
        mp3: 'b.mp3'
    },
    {
        key: 'a1',
        mp3: 'a.mp3'
    },
    {
        key: 'a1',
        mp3: 'a.mp3'
    },
    {
        key: 'f1',
        mp3: 'f.mp3'
    },
    {
        key: 'f1',
        mp3: 'f.mp3'
    },
    {
        key: 'f1',
        mp3: 'f.mp3'
    },
    {
        key: 'f1',
        mp3: 'f.mp3'
    },
    {
        key: 'f1',
        mp3: 'f.mp3'
    },

];
const play = document.querySelector('.play');
const pianoButton = `<div class="button-piano" data-mp3="[dataMP3]"></div>`;
const belt = document.querySelector('.black-belt');
const arrayBtn = [
    [
        {    key: 'c1',
            mp3: 'c.mp3',
        },
        {
            key: 'd1',
            mp3: 'd.mp3'
        }
    ],
    [
        {
            key: 'e1',
            mp3: 'e.mp3'
        },
        {
            key: 'f1',
            mp3: 'f.mp3'
        },
        {
            key: 'a1',
            mp3: 'a.mp3'
        },
    ],
    [
        {
            key: 'a1',
            mp3: 'a.mp3'
        },
        {
            key: 'b1',
            mp3: 'b.mp3'
        },
    ],
    [
        {
            key: 'b1',
            mp3: 'b.mp3'
        },
        {
            key: 'a1',
            mp3: 'a.mp3'
        },
        {
            key: 'b1',
            mp3: 'b.mp3'
        },
    ]
];
const pianoContainer = document.querySelector('.piano-container');
const { offsetWidth } = document.querySelector('.audio');
const timeElement = document.querySelector('.time');
let playedSongs = [];
const btnSave = document.querySelector('.save');
const inp = document.querySelector('input');
let globalIndex = 0;
let playArray = [];
let value = -100;
let duration = 0;
let offset = 0;
let pausedSound = null;
let durationTime = 0;
let isNewSound = false;
let interval = null;

const init = () => {
    const listLocalStorage = JSON.parse(localStorage.getItem('playedSongs'));
    if (listLocalStorage.length > 0) {
        playedSongs = listLocalStorage;
        createList();
    }
};

const createList = () => {
    soundsTable.innerHTML = '';
    playedSongs.forEach((el, index) => {
        soundsTable.innerHTML += `
                        <tr>
                            <td></td>
                            <td>${ index + 1 }</td>
                            <td>${ el.title }</td>
                            <td>${ el.time.toFixed(1) } s</td>
                            <td>${ el.date} </td>
                            <td>
                                <div class="container-btn">
                                    <button class="songs-list-btn btn-play"><i class="fa fa-play-circle-o" aria-hidden="true"></i></button>
                                    <button class="songs-list-btn btn-trash"><i class="fa fa-trash" aria-hidden="true"></i></button>
                                </div>
                            </td>
                         </tr>`;
    });

    getElementsAndCreateActions('.btn-trash', (index) => {
        playedSongs = playedSongs.filter((el, id) => id !== index);
        localStorage.setItem('playedSongs', JSON.stringify(playedSongs));
        createList();
    });
    getElementsAndCreateActions('.btn-play', (index) => {
        clearInterval(interval);
        offset = 0;
        document.querySelector('.audio').style.transform = `translateX(${ 0 }px)`;
        timeElement.textContent = '';
        document.querySelector('.play').classList.add('btn--disabled');
        timeElement.style.display = 'block';
        assignClasses('.play', '.pause');
        durationTime = 0;
        globalIndex = 0;
        isNewSound = false;
        playArray = playedSongs[index].song;
        duration = 0;
        playArray.forEach((el, index) => {
            const audioElement = new Audio(el);
            audioElement.addEventListener('loadedmetadata', (e) => {
                duration += audioElement.duration;
                console.dir(audioElement)
                if (index === playArray.length - 1) {
                    playAudio();
                }
            });
        });
    });
};

const getElementsAndCreateActions = (cls, cb) => {
    document.querySelectorAll(cls).forEach((el, index) => {
        el.addEventListener('click', cb.bind(null, index));
    });
};

init();

const playAudio = () => {
    let newAudio = pausedSound ? pausedSound : new Audio(playArray[globalIndex]);
    pausedSound = null;
    const newAudioLoaded = () => {
        newAudio.addEventListener('timeupdate', (e) => {
            console.log(newAudio.ended, 'before Endd');
            console.log(newAudio.duration, newAudio.currentSrc)
            if (newAudio.ended) {
                globalIndex++;
                if (globalIndex < playArray.length + 1) {
                    playAudio();
                } else {
                    globalIndex = 0;
                    playArray = [];
                }
            }
        });
    }
    newAudio.removeEventListener("timeupdate", newAudioLoaded);
    newAudio.addEventListener('loadedmetadata', (e) => {
        newAudioLoaded();

    });
    newAudio.play();

    if (globalIndex === 0) {
        timeUpdate();
    }
    document.querySelector('.pause').addEventListener('click', () => {
        assignClasses('.pause', '.play');
        newAudio.pause();
        pausedSound = newAudio;
        isNewSound = false;
    });
};
const timeUpdate = () => {
    interval = setInterval(() => {
        if (pausedSound === null) {
            durationTime++;
            offset += offsetWidth / (duration * 1000);
            document.querySelector('.audio').style.transform = `translateX(${ Math.ceil(offset) * time }px)`;
            timeElement.textContent = `${ ((durationTime * time) / 1000).toFixed(1) }/ ${ duration.toFixed(1) }`;
        }
        if (Math.ceil(offset) * time >= offsetWidth) {
            clearInterval(interval);
            offset = 0;
            document.querySelector('.audio').style.transform = `translateX(${ 0 }px)`;
            playArray = [];
            globalIndex = 0;
            duration = 0;
            assignClasses('.pause', '.play');
            timeElement.textContent = '';
            document.querySelector('.play').classList.add('btn--disabled');
        }
    }, 1);
};
const playPianoMusic = buttons => {
    buttons.forEach(el => {
        el.addEventListener('click', () => {
            const playBtn = document.querySelector('.play');
           durationTime = 0;
            timeElement.textContent = '';
            if (playBtn.classList.contains('btn--disabled')) {
                playBtn.classList.remove('btn--disabled');
            }
            if (globalIndex === playArray.length) {
                playArray = [];
                isNewSound = true;
            }
            const path = './sounds/' + el.getAttribute('data-mp3');
            playArray.push(path);
            new Audio(path).play();
        });
    });
};

pianoKeys.forEach(el => buttonsContainer.innerHTML += pianoButton.replace('[dataMP3]', el.mp3));
arrayBtn.forEach(() => belt.innerHTML += `<div class="black-buttons-container"></div>`);
const btnBlackContainer = document.querySelectorAll('.black-buttons-container');

btnBlackContainer.forEach((el, index) => {
    const boundingClientRect = btnBlackContainer[index - 1]?.getBoundingClientRect();
    boundingClientRect ? el.style.left = boundingClientRect.right + 128 - pianoContainer.getBoundingClientRect().left + 'px': el.style.left = '54px';
    arrayBtn[index].forEach(els => el.innerHTML += `<div class="key-black" data-mp3="${ els.mp3 }"></div>`);
});

playPianoMusic(document.querySelectorAll('.button-piano, .key-black'));
play.addEventListener('click', () => {
    duration = 0;
    timeElement.style.display = 'block';
    assignClasses('.play', '.pause');
    playArray.forEach((el, index) => {
        const audioElement = new Audio(el);
        audioElement.addEventListener('loadedmetadata', (e) => {
            duration += audioElement.duration;
            if (index === playArray.length - 1) {
                if (isNewSound) {
                    document.querySelector('.modal-overlay').classList.add('modal-overlay--active');
                    const createTableAudiElement = (e) => {
                        const dateSave = new Date();
                        playedSongs.push({
                            id: null,
                            title: inp.value,
                            time: duration,
                            date: `${ createDateSongsList(dateSave.getDate()) }/${ createDateSongsList(dateSave.getMonth() + 1, true) }/${ dateSave.getFullYear() }, ${ createDateSongsList(dateSave.getHours()) }:${ createDateSongsList(dateSave.getMinutes()) }`,
                            song: playArray,
                        });
                        createList();
                        playAudio();
                        inp.value = '';
                        document.querySelector('.modal-overlay').classList.remove('modal-overlay--active');
                        btnSave.removeEventListener('click', createTableAudiElement);
                        btnSave.classList.add('btn--disabled');
                        localStorage.setItem('playedSongs', JSON.stringify(playedSongs));
                    };
                    btnSave.addEventListener('click', createTableAudiElement);
                } else {
                    playAudio();
                }
            }
        });
    });
});
const createDateSongsList = (dateEl, isMonth = false) => (dateEl < 10 ? '0' : '') + (dateEl + (isMonth ? 1 : 0));

const assignClasses = (cls1, cls2) => {
    document.querySelector(cls1).classList.add('btn--disabled');
    document.querySelector(cls2).classList.remove('btn--disabled');
};
document.addEventListener('keyup', (e) => {
    if (inp.value.length > 4) {
        btnSave.classList.remove('btn--disabled');
    } else {
        btnSave.classList.add('btn--disabled');
    }
});