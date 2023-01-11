const quizApi = 'https://quizapi.io/api/v1/questions?apiKey=a3a6zO32OM5fEK8w72XIpuIRmaizSKMfG2bx8bsj&tags=HTML&limit=20'
const root = document.getElementById('root') 

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

fetch(quizApi)
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
        // questions.map((question,index) => {
        //     const questionHtml = document.createElement('div')
        //     questionHtml.className = 'question_wrapper'
        //     questionHtml.innerHTML = `
        //     <h3 data-index="${index}" class="question"></h3>`
        
        
        //     questionHtml.querySelector('.question').innerText = question.question
        
        //     for (let answer in question.answers) {  
        //         let answerText = question.answers[answer] 
        //         if (answerText) {
        //             const answerHtml = document.createElement('div')
        //             answerHtml.className = 'answer_wrapper'
        //             answerHtml.innerHTML = `
        //             <button onclick="check(event)" data-id="${answer}" class="answer"></button>`
        //             answerHtml.querySelector('.answer').innerText = answerText
        //             questionHtml.appendChild(answerHtml)
        //         }
        //     } 
        //     root.appendChild(questionHtml)   
        // })
    })
    .catch((error) => {
        console.log(error)
    })  
 
    console.log(questions)

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const startBtn = $('#start-btn')
const questionWrapper = $('.question_wrapper')
const question = $('.question')
const answerWrapper = $('.answer_wrapper')  
const audio = $('#audio')

const app = {
    currentQuestion: 0,

    showQuestion() {    
        let quest = questions[this.currentQuestion]
        let correctAns = quest.correct_answer
        question.innerText = quest.question 
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
                })  
                answerWrapper.appendChild(answer)
            } 
        }
    },
    nextQuestion() {
        answerWrapper.innerHTML = ''
        this.currentQuestion++
        this.showQuestion()
    },   
    start() {
        startBtn.addEventListener('click', function() {
            startBtn.classList.add('hide')
            questionWrapper.classList.remove('hide')
            audio.play()
            audio.loop = true
            app.showQuestion()
        })
    }
}

app.start()
