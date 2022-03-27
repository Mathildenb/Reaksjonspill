
        //henter ut html-elementer og lager variabler
        let bodyEl = document.querySelector('body');

        let spillskjermEl = document.querySelector('#spillskjerm');

        let spillerEl_1 = document.querySelector('#spiller1');
        let spillerEl_2 = document.querySelector('#spiller2');

        let instruksEl = document.querySelector('#instruks');

        let scoreEl_1 = document.querySelector('#score_1');
        let scoreEl_2 = document.querySelector('#score_2');

        let knappBtn_1 = document.querySelector('#knapp_1');
        let knappBtn_2 = document.querySelector('#knapp_2');

        let vinnerEl_1 = document.querySelector('#vinner_1');
        let vinnerEl_2 = document.querySelector('#vinner_2');
        let brukernavnEl_1 = document.querySelector('#brukernavn_1');
        let brukernavnEl_2 = document.querySelector('#brukernavn_2');

        let startSound = document.querySelector('#startSound'); 

        let spinnerEl = document.querySelector('#spinner');

        let timeout = 0; 

        //bruker .animate metode for å lage animasjonen på spinneren 
        let spinnerAnimation = spinnerEl.animate([
            {
                transform: 'rotate(0)'
            },
            {
                transform: 'rotate(359deg)'
            }
        ], {
            duration: 1000,
            iterations: Infinity    
        })

        //stopper spinneren ved start
        spinnerAnimation.cancel();

        //legger til en lytter for når en tast trykkes ned i body elementet
        bodyEl.addEventListener('keydown', lesTast);

        //legger til en lytter for når brukeren trykker på spinneren
        spinnerEl.addEventListener('click', lesTast);

        //legger til en lytter for når knappene trykkes på
        knappBtn_1.addEventListener('click', lesTast);
        knappBtn_2.addEventListener('click', lesTast);
        
        //bruker objekter for å lagre all informasjonen knyttet til hver spiller
        let spiller1 = {stopptid:0, millisekund:0, sekund:0, status:'stopp', poeng:0}; 
        let spiller2 = {stopptid:0, millisekund:0, sekund:0, status:'stopp', poeng:0};
        
        //nullstiller tiden
        let spill = {starttid:0};

        //funksjon som regner ut reaksjonstiden, og lagrer den for hver spiller
        function beregnTid(spiller, start, stopp){
                    let gap = stopp - start;
                    
                    let millisekund = 0;
                    let sekund = 1000;
                    let minutt = sekund * 60;
    
                    spiller.sekund = Number(Math.floor((gap % minutt) / sekund));
                    spiller.millisekund = Number(Math.floor(gap % sekund));
        }

        //koden inni denne funksjonen skjer hver gang en ny runde begynner 
        function startSpill(){
            spillerEl_1.style.backgroundColor = "orange";
            spillerEl_2.style.backgroundColor = "orange";

            //har ikke kåret en vinner enda, så denne diven blir tom
            vinnerEl_1.innerText = "";
            vinnerEl_2.innerText = "";

            //endrer statusen til spillet til "venter"
             spiller1.status = 'venter';
             spiller2.status = 'venter';

            //nullstiller tidtakeren før neste runde (variablene i js)
            spiller1.stopptid = 0, spiller1.millisekund = 0, spiller1.sekund = 0;
            spiller2.stopptid = 0, spiller2.millisekund = 0, spiller2.sekund = 0;

            //nullstiller tidtaker før neste runde (teksten i html)
            document.querySelector(".sekund_1").innerText = spiller1.sekund;
            document.querySelector(".millisekund_1").innerText = spiller1.millisekund;
            document.querySelector(".sekund_2").innerText = spiller2.sekund;
            document.querySelector(".millisekund_2").innerText = spiller2.millisekund;

            //bruker Math.random for å få en tilfeldig ventetid
            let forsinkelse = Math.floor(Math.random() * 10000); 

            //når random ventetiden er ferdig, starter timeren (kaller på startTimer funksjonen) 
            timeout = setTimeout(startTimer, forsinkelse)

            //oppdaterer informasjon til brukeren, ved å kalle på "oppdaterTekst" funksjonen
            oppdaterTekst("Vent!", 'start');
        }

        //koden i denne funksjonen skjer når spillet stopper
        function stoppSpill(spiller){
            //spesialsjekk for å unngå at man kan trykke før tiden, da taper man
            if((spiller1.status === 'venter') && (spiller2.status === 'venter')){
                if(spiller ==='spiller1'){
                    //endrer spillstatus til juks
                    spiller1.status = 'juks';
                    
                    //gjør andre endringer som vi vil at skal skje for å oppdatere resultatene
                    spillerEl_1.style.backgroundColor = "red";
                    spillerEl_2.style.backgroundColor = "green";
                    spiller2.poeng ++;
                    scoreEl_2.innerText = "Score: " + spiller2.poeng;
                    vinnerEl_2.innerText = brukernavnEl_2.value + " vant!";
                    vinnerEl_1.innerText = brukernavnEl_1.value + " trykket for tidlig...";
                }
                if(spiller ==='spiller2'){
                    //endrer spillstatus til juks
                    spiller2.status = 'juks';

                    //gjør andre endringer som vi vil at skal skje for å oppdatere resultatene
                    spillerEl_1.style.backgroundColor = "green";
                    spillerEl_2.style.backgroundColor = "red";
                    spiller1.poeng ++;
                    scoreEl_1.innerText = "Score: " + spiller1.poeng;
                    vinnerEl_1.innerText = brukernavnEl_1.value + " vant!";
                    vinnerEl_2.innerText = brukernavnEl_2.value + " trykket for tidlig...";
                } 

                //oppdaterer informasjon til brukeren, ved å kalle på "oppdaterTekst" funksjonen
                oppdaterTekst("Trykk Space for ny runde!", 'stop');   
            }

            //koden her skjer når spiller 1 trykker på tasten sin (a)
            if ((spiller1.status === 'spill') && (spiller ==='spiller1')){

                //lagrer tidspunktet tasten blir trykket på, da stopper timeren
                stopptid = new Date().getTime();

                //kaller på funksjonen som regner ut reaksjonstiden
                beregnTid(spiller1, spill.starttid, stopptid);

                //oppdaterer tidtakeren (teksten i html)
                document.querySelector(".sekund_1").innerText = spiller1.sekund;
                document.querySelector(".millisekund_1").innerText = spiller1.millisekund;

                //endrer spillstatus til stopp
                spiller1.status = 'stop';

                if(spiller2.status === 'spill'){ //denne koden skjer om spiller 1 var først til å trykke på tasten

                    //gjør andre endringer som vi vil at skal skje for å oppdatere resultatene
                    spillerEl_1.style.backgroundColor = "green";
                    spillerEl_2.style.backgroundColor = "red";
                    spiller1.poeng ++;
                    scoreEl_1.innerText = "Score: " + spiller1.poeng;
                    vinnerEl_1.innerText = brukernavnEl_1.value + " vant!";

                    //oppdaterer informasjon til brukeren, ved å kalle på "oppdaterTekst" funksjonen
                    oppdaterTekst("Trykk Space eller på sirkelen for ny runde!", 'stop'); 
                }
            }
            //koden her skjer når spiller 2 trykker på tasten sin (arrow left)
            else if((spiller2.status === 'spill') && (spiller ==='spiller2')){

                //lagrer tidspunktet knappen blir trykket på, da stopper timeren
                stopptid = new Date().getTime();

                //kaller på funksjonen som regner ut reaksjonstiden
                beregnTid(spiller2, spill.starttid, stopptid);

                //oppdaterer tidtakeren (teksten i html)
                document.querySelector(".sekund_2").innerText = spiller2.sekund;
                document.querySelector(".millisekund_2").innerText = spiller2.millisekund;

                //endrer spillstatus til stopp
                spiller2.status = 'stop';

                if(spiller1.status === 'spill'){ //denne koden skjer om spiller 1 var først til å trykke på tasten

                    //gjør andre endringer som vi vil at skal skje for å oppdatere resultatene
                    spillerEl_2.style.backgroundColor = "green";
                    spillerEl_1.style.backgroundColor = "red";
                    spiller2.poeng ++;
                    scoreEl_2.innerText = "Score: " + spiller2.poeng;
                    vinnerEl_2.innerText = brukernavnEl_2.value + " vant!";

                    //oppdaterer informasjon til brukeren, ved å kalle på "oppdaterTekst" funksjonen
                    oppdaterTekst("Trykk Space for ny runde!", 'stop'); 
                }        
            }
        }

        //funksjon som starter timeren
        function startTimer(){

            //lagrer tidspunktet reaksjonstiden starter på
            spill.starttid = new Date().getTime();

            //endrer spillet sin status til "spill"
            spiller1.status = 'spill'
            spiller2.status = 'spill'

            /*bakgrunnsfargen blir grønn og det spilles av lyd for å 
            tydeligjøre at spillet er igang*/
            spillerEl_1.style.backgroundColor = "lightgreen";
            spillerEl_2.style.backgroundColor = "lightgreen";
            startSound.play();

            //oppdaterer informasjon til brukeren, ved å kalle på "oppdaterTekst" funksjonen
            oppdaterTekst("Trykk!", 'stop'); 

            //stopper spinneren
            spinnerAnimation.cancel();
        }
    
        //funksjonen skjer når det registreres et tastetrykk
        function lesTast(){ 
            if((event.code === 'Space') || (event.srcElement === spinnerEl)){
                startSpill(); //når brukeren trykker space eller på sirkelen starter spillet
            }
            if((event.key === 'a') || (event.srcElement === knappBtn_1)){
                stoppSpill('spiller1'); //når brukeren trykker a eller på knappen kjøres stoppfunksjonen
            }
            if((event.key === 'ArrowLeft') || (event.srcElement === knappBtn_2)){
                stoppSpill('spiller2'); //når brukeren trykker arrow left eller på knappen kjøres stoppfunksjonen
            }
        }

        //denne funksjonen skjer for å oppdatere informasjon til brukeren
        function oppdaterTekst(tekst,status){

             //oppdaterer informasjon til brukeren 
             instruksEl.innerText = tekst;

             if(status === 'stop'){
                //stopper spinneren
                spinnerAnimation.cancel(); 
                //stopper timeren
                clearTimeout(timeout);
            }
            if(status === 'start'){
                //stopper spinneren
                spinnerAnimation.play(); 
            }
        }