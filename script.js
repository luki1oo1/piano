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
        key: 'c2',
        mp3: 'c.wav'
    },
    {
        key: 'd2',
        mp3: 'c.wav'
    },
    {
        key: 'e2',
        mp3: 'c.wav'
    },
    {
        key: 'f2',
        mp3: 'c.wav'
    },
    {
        key: 'g2',
        mp3: 'c.wav'
    },
    {
        key: 'a3',
        mp3: 'c.wav'
    },
    {
        key: 'b3',
        mp3: 'c.wav'
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
            key: 'f2',
            mp3: 'c.wav'
        },
    ],
    [
        {
            key: 'a3',
            mp3: 'c.wav'
        },
        {
            key: 'b3',
            mp3: 'c.wav'
        },
    ],
    [
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
    ]
];
const pianoContainer = document.querySelector('.piano-container');
let index = 0;
let playArray = [];

const playAudio = () => {
    const newAudio = new Audio(playArray[index]);
    newAudio.play();
    newAudio.addEventListener('timeupdate', (e) => {
        if (newAudio.ended) {
            index++;
            playAudio();
        }
    });
};

const playPianoMusic = buttons => {
    buttons.forEach(el => {
        el.addEventListener('click', () => {
            if (index === playArray.length) {
                playArray = [];
                index = 0;
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
play.addEventListener('click', playAudio);

//player z czasem, pausa, pasek przesuwający sie