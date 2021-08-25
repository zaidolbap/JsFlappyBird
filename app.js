document.addEventListener('DOMContentLoaded', () =>{

    const intervalTime = 30 // ms

    class Doodler {
        constructor(startLeft){
            this.startPoint = 150
            this.bottom = this.startPoint
            this.left = startLeft
            
            this.isJumping = false
            this.verticalTimer

            this.visual = document.createElement('div')
            this.visual.classList.add('doodler')
            this.visual.style.left = this.left + 'px'
            this.visual.style.bottom = this.bottom + 'px'

            document.addEventListener('keydown', this.control)
        }

        jump(){
            this.startPoint = this.bottom
            clearInterval(this.verticalTimer)
            this.isJumping = true
            this.verticalTimer = setInterval(()=>{
                this.bottom += 20
                this.visual.style.bottom = this.bottom + 'px'
                if(this.bottom > this.startPoint+200){
                    this.fall()
                }
            }, intervalTime)
        }
        fall(){
            clearInterval(this.verticalTimer)
            this.isJumping = false
            this.verticalTimer = setInterval(()=>{
                this.bottom -= 5
                this.visual.style.bottom = this.bottom + 'px'
            }, intervalTime)
        }
        control=(e)=>{
            const step = 5
            if(e.key === "ArrowLeft"){
                if(this.left >= 0){
                    this.left -= step
                } else {
                    this.left = 340
                }
            } else if(e.key === "ArrowRight"){
                if(this.left <= 340){
                    this.left += step
                } else {
                    this.left = 0
                }  
            }
            this.visual.style.left = this.left + 'px'
        }
    }

    class Platform {
        constructor(bottom){
            this.bottom = bottom
            this.left = Math.random() * 315 // random number [0, 315]

            this.visual = document.createElement('div')
            this.visual.classList.add('platform')
            this.visual.style.left = this.left + 'px'
            this.visual.style.bottom = this.bottom + 'px'
        }
    }

    class Game {
        constructor(){
            const maxPlatforms = 5
            this.score = 0
            this.isGameOver = false
            this.grid = document.querySelector('.grid')

            this.platforms = []
            for(let i=0; i<maxPlatforms; ++i){
                let gap = 600 / maxPlatforms
                let bottom = 100 + i * gap
                let platform = new Platform(bottom)
                this.platforms.push(platform)
                this.grid.appendChild(platform.visual)
                console.log(this.platforms)
            }
            
            this.doodler = new Doodler(this.platforms[0].left)
            this.grid.appendChild(this.doodler.visual)
        }

        movePlatforms(){
            if(this.doodler.bottom > 200) {
                this.platforms.forEach(platform => {
                    platform.bottom -= 3
                    let visual = platform.visual
                    visual.style.bottom = platform.bottom + 'px'
    
                    if (platform.bottom < 10){
                        this.platforms[0].visual.classList.remove('platform')
                        this.platforms.shift()
                        console.log(this.platforms)
                        let newPlatform = new Platform(600)
                        this.platforms.push(newPlatform)
                        this.grid.appendChild(newPlatform.visual)
                        console.log(this.platforms)
                    }
                })
            }
        }

        calculateCollisions=()=>{
            this.movePlatforms()

            if(this.doodler.bottom <= 0){
                this.gameOver()
            } else {
                this.platforms.forEach(platform=>{
                    if((this.doodler.bottom>=platform.bottom)&&
                       (this.doodler.bottom<=platform.bottom+15)&&
                       (this.doodler.left+60>=platform.left) &&
                       (this.doodler.left <= platform.left+85)&&
                       !this.doodler.isJumping) {
                        console.log('landed')
                        this.score++
                        this.doodler.jump()
                    }
                })
            }
        }

        gameOver(){
            console.log('game over')
            this.isGameOver = true
            while(this.grid.firstChild){
                this.grid.removeChild(this.grid.firstChild)
            }
            this.grid.innerHTML = this.score
            clearInterval(this.calculateCollisions)
        }

        start(){
            if(!this.isGameOver){
                this.doodler.fall()
                setInterval(this.calculateCollisions, intervalTime)
            }
        }
    }

    let game = new Game()
    game.start()
}
)