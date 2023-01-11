const root = document.getElementById('root') 

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const optionsWrapper = $('.options')
const options = $$('.option')
const controls = $('.controls')
const questionLeft = $('.question-total')
const muteBtn = $('.mute')
const navbar = $('.home')

const questions = []

let correctCount = 0

function check(e) { 
    const index = e.target.closest('.question_wrapper').querySelector('.question').dataset.index
    const correct = questions[index].correct_answer
    const answerSelect = e.target.dataset.id
    if (correct === answerSelect) {
        ++correctCount  
        document.querySelector('.correct_count').innerText = correctCount
        e.target.style.backgroundColor = 'green'
    } else {
        e.target.style.backgroundColor ='red'
    }
}    
  
const questionWrapper = $('.question_wrapper')
const question = $('.question')
const answerWrapper = $('.answer_wrapper')  
const audio = $('#audio')

const app = {
    currentQuestion: 0,
    isSelected: false, 
    isPlayed: false,
    showQuestion() {    
        let quest = questions[this.currentQuestion]
        let correctAns = quest.correct_answer
        question.innerText = quest.question  
        questionLeft.innerText = `${this.currentQuestion+1}/${questions.length}`
        for (let ans in quest.answers) {
            let ansText = quest.answers[ans]  
            if (ansText) {
                let answer = document.createElement('div')
                answer.className = 'answer'
                answer.setAttribute('data-ans', `${ans}`) 
                answer.innerHTML = `
                <button style="background-color: var(--${ans}-color);" class="btn"></button>
                `
                answer.querySelector('.btn').innerText = ansText
                answer.addEventListener('click', function(event) {
                    if (!app.isSelected) {
                        event.target.style.border = '2px solid #fff'
                        event.target.classList.add('selected')
                        let ansSelected = event.target.closest('.answer').dataset.ans 
                        setTimeout(function() {
                            if (correctAns.includes(ansSelected)) {
                                event.target.classList.add('right')
                                
                            } else {
                                event.target.classList.add('wrong') 
                            }
                        },2000)
                        setTimeout(function() { 
                            app.nextQuestion()
                        },4000)
                        app.isSelected = true
                    } 
                })  
                answerWrapper.appendChild(answer)
            } 
        }
    },
    nextQuestion() {
        answerWrapper.innerHTML = ''
        this.currentQuestion++
        this.isSelected = false
        this.showQuestion()
    },   
    start() { 
        options.forEach(option => {
            option.addEventListener('click', (e) => { 
                controls.classList.add('fade')
                setTimeout(function() {
                    controls.classList.add('hide')  
                    selectOption = e.target.innerText 
                    fetch(`https://quizapi.io/api/v1/questions?apiKey=a3a6zO32OM5fEK8w72XIpuIRmaizSKMfG2bx8bsj&tags=${selectOption}&limit=20`)
                        .then((response) =>  { 
                            return response.json()
                        })
                        .then((quizs) =>  {    
                            console.log(quizs)
                            quizs.map((quiz,index) => { 
                                let correctAnswer =[]
                                for (let correct in quiz.correct_answers) {
                                    if (quiz.correct_answers[correct] === "true") {
                                        correctAnswer.push(correct.slice(0, 8))
                                    }
                                }   
                                questions.push({
                                    question: quiz.question,
                                    answers: quiz.answers,
                                    correct_answer: correctAnswer,
                                    explanation: quiz.explanation
                                })
                            })     
                        })
                        .catch((error) => {
                            console.log(error)
                        })     
                    console.log(questions)   
                    questionWrapper.classList.remove('hide')
                    
                    muteBtn.addEventListener("click", () =>{
                        if (this.isPlayed) {
                            audio.pause() 
                            this.isPlayed = false  
                        } else {
                            audio.play()
                            this.isPlayed = true
                        }
                        muteBtn.classList.toggle('playing')
                    })  
                    this.isPlayed = true 
                    audio.play()
                    audio.loop = true 
                    questionLeft.classList.remove('hide')
                    navbar.classList.remove('hide')
                    setTimeout(() => {
                        app.showQuestion()
                    }, 1000) 
                },1000)
            })
        }); 
    }
}

app.start()
