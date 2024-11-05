const playSound = (soundToPlay, soundsOn = true) => {

    if (soundsOn){

        soundToPlay.play();
    }
}

export default playSound;