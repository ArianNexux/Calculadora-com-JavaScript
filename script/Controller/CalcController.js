class CalcController{


    constructor(){
        this._audio = new Audio('click.mp3')
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = []; 
        this._locale = "pt-br"
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._audioOnOff = false
        this.initialize()
        this.initButtonEvents()
        this.initKeyboard()
        this.copyToClipboard()
    }

    copyToClipboard(){

        let input = document.createElement('input')

        input.value = this.displayCalc
        document.body.appendChild(input)

        input.select()

        document.execCommand("Copy");
      
        input.remove()


    
    }
   pasteFromClipboard(){

        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text')
            this.displayCalc = parseFloat(text)
            console.log(text)
        
        })
   }
    initialize(){
        this.setNumberDisplay()
        this.setDisplayDateTime()
     
        setInterval(
            ()=>{
                this.setDisplayDateTime()
            }
        ,1000)
        this.pasteFromClipboard()
            document.querySelectorAll('.btn-ac').forEach(btn=>{
                btn.addEventListener('dblclick',e=>{

                    this.toggleAudio()

                })
               
            })
    }
    toggleAudio(){

        this._audioOnOff = !this._audioOnOff

    }

    playAudio(){
        if(this._audioOnOff == true){
            this._audio.currentTime = 0
            this._audio.play()
        }
    }
    initKeyboard(){
     

        document.addEventListener('keyup',e=>{
            this.playAudio()
            switch(e.key){
                case "+":
                case "-":
                case "*":
                case "/":  
                case "%":
                    this.addOperation(e.key)
                    break;
             
                case "Enter":
                case "=":
                    this.calc()
                    break;
            
                case "Escape":
                    this.clearAll()
                    break; 
                case "Backspace":
                    this.clearEntry()
                    break;  
                
                case ',':
                case '.':
                    this.addDot()
                    break
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key))
                    
                    break; 
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard()
                    break;
            
        }
        })
    }
    clearAll(){
        this._operation = []
        this.lastNumber = 0
        this._lastOperator = 0
        this.setNumberDisplay()
    }

    clearEntry(){
        this._operation.pop()
        this.setNumberDisplay()
    }

    setError(){

        this.displayCalc = "ERROR"
        
    }
    getResult(){
        try{
            return eval(this._operation.join(""))
        }catch(e){
            setTimeout(
                this.setError()
            ,  1)
            
     }   
}
    calc(){
     
        let last = ''
        this._lastOperator = this.getLastItem()

        if(this._operation.length < 3){
            let firstNumber = this._operation[0]
            this._operation= [firstNumber, this._lastOperator, this._lastNumber]
        }

        if(this._operation.length > 3){

            last =  this._operation.pop()
            this._lastNumber = this.getLastItem(false)
        
        
        }else if(this._operation.length == 3){
            
            this._lastNumber = this.getLastItem(false)

        }
        

 
        let result = this.getResult()
        
        if(last == '%'){
            
            result /= 100

            this._operation = [result]
            
        }else{

            this._operation = [result]

            if(last) this._operation = [result, last]

        }   
    
        this.setNumberDisplay()
    }

    pushOperation(value){

        this._operation.push(value)

        if(this._operation.length > 3){

            this.calc()
           
        }
    }
    addEventListenerAll(element, events, fn){

        events.split(" ").forEach(event =>{
            element.addEventListener(event, fn, false)
        })
    }
    setLastOperation(value){
        this._operation[this._operation.length - 1] = value
    }
    isOperator(value){

        return (['+','-','/','%','*'].indexOf(value) > -1)

    }
    addDot(){
        let lastOperation = this.getLastOperation()

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1){
            return;
        }
        
        if(this.isOperator(lastOperation) || !lastOperation)
        {
            this.pushOperation('0.')
        }else{
            this.setLastOperation(lastOperation.toString() + '.')
        }

        this.setNumberDisplay()
    }
   getLastItem(isOperator = true){
       let lastItem

            for( let i = this._operation.length-1;i>=0;i-- ){
                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i]
                    break; 
                }
            
        }
        if(!lastItem) {

             lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        
            }
        return lastItem;
   
   }

    setNumberDisplay(){


        let lastNumber = this.getLastItem(false)
        if(!lastNumber) lastNumber = 0
        
        this.displayCalc = lastNumber
    }
    addOperation(value){
     
        if(this._operation.length > 0){
        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){

                this._operation[this.getLastOperation()] = value
               
            }
            else{

            if(
                this.isOperator(this.getLastOperation())){

                this.pushOperation(value)
                
            }
            else{  

                this.setLastOperation(value)
                this.setNumberDisplay()
            }
            }
        }
        else{ 
           
            if(this.isOperator(value)){

                this.pushOperation(value)
                
            }
            else{ 
                let newValue = this.getLastOperation().toString() + value.toString()     
                this.setLastOperation(newValue)
                this.setNumberDisplay()
            }
            }
        }
    
        else{

            this._operation.push(value)
            this.setNumberDisplay()

        }
       
    }

    getLastOperation(){

        return this._operation[this._operation.length - 1]

    }
    execBtn(value){

      this.playAudio()
    switch(value){
            case "soma":
                this.addOperation("+")
                break;
            case "multiplicacao":
                this.addOperation("*")
                break;
            case "subtracao":
                this.addOperation("-")
                break;
            case "igual":
                this.calc()
                break;
            case "divisao":
                this.addOperation("/")
                break; 
            case "ac":
                this.clearAll()
                break; 
            case "ce":
                this.clearEntry()
                break;  
            case "porcento":
                this.addOperation("%")
                break; 
            case 'ponto':
                this.addDot()
                break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(value)
                
                break; 
            default:           
                this.setError()
        }
    }
    initButtonEvents(){

         let buttons = document.querySelectorAll("#buttons > g, #parts > g")
         
         buttons.forEach(btn=>{
     
         this.addEventListenerAll(btn, 'click drag',e=>{ 
               
                let textBtn = btn.className.baseVal.replace("btn-","")
                
                this.execBtn(textBtn)
         })
         this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=>{
             btn.style.cursor = "pointer"
         }
         )
        }
         )
    }
    
    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale,
            {
                day:"2-digit",
                month:"long",
                year:"numeric"
            })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
  
    }

    get displayTime(){
        return this._timeEl.innerHTML
    }

    get displayDate(){
        return this._dateEl.innerHTML
    }

    set displayTime(value){
        this._timeEl.innerHTML = value
    }

    set displayDate(value){
        this._dateEl.innerHTML = value
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        if(value.toString().length > 10) 
        {
            this.setError()
            return
        }
        this._displayCalcEl.innerHTML = value
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(valor){
        this._dateEl.innerHTML = valor;
    }

}