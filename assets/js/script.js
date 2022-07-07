/**
 * ELEMENTS
 */

const seuVotoPara = document.getElementById('voto_para');
const cargo = document.getElementById('cargo');
const descricao = document.querySelector('.descricao');
const aviso = document.querySelector('.inferior-info');
const lateral = document.querySelector('.area-direita');
const numeros = document.querySelector('.numeros');
const infos = document.querySelector('.modal');
const relogioEl = document.querySelector('.relogio');

const AUDIO_PROXIMA_ETAPA = 'assets/audio/enter.mp3';
const AUDIO_FIM = 'assets/audio/fim.mp3';


/**
 * TECLADO
 */
document.body.addEventListener('keyup', (e) => {
    let press = e.key
    let numeros = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if (numeros.indexOf(press) != -1) {
        clicou(press)
    } else if (e.keyCode == 13) {
        confirma();
    } else if (e.keyCode == 27 || e.keyCode == 67) {
        corrige();
    } else if (e.keyCode == 66) {
        votarBranco();
    }
});


/**
 * RELÓGIO NA URNA
 */
const atualizarRelogio = () => {
    let hora = new Date();
    ds = hora.getDay();
    switch (ds) {
        case 0:
            ds = 'DOM';
            break;

        case 1:
            ds = 'SEG';
            break;

        case 2:
            ds = 'TER';
            break;

        case 3:
            ds = 'QUA';
            break;

        case 4:
            ds = 'QUI';
            break;

        case 5:
            ds = 'SEX';
            break;

        case 6:
            ds = 'SAB';
            break;

        default:
            break;
    }
    dia = hora.getDate().toString().length < 2 ? '0' + (hora.getDate()) : (hora.getDate());
    mes = hora.getMonth().toString().length < 2 ? '0' + (hora.getMonth() + 1) : (hora.getMonth() + 1);
    ano = hora.getFullYear();
    h = hora.getHours().toString().length < 2 ? '0' + hora.getHours() : hora.getHours();
    m = hora.getMinutes().toString().length < 2 ? '0' + hora.getMinutes() : hora.getMinutes();
    s = hora.getSeconds().toString().length < 2 ? '0' + hora.getSeconds() : hora.getSeconds();
    let str = ds + ' ' + dia + '/' + mes + '/' + ano + ' ' + h + ':' + m + ':' + s;
    if (relogioEl) {
       relogioEl.innerHTML = str; 
    }   
}

setInterval(atualizarRelogio, 100);


/**
 * BOTÃO REINICIAR
 */
const reiniciar = () => {
    document.location.reload(true);
}


/**
 * BOTÃO INFORMAÇÕES
 */
const info = () => {
    if (infos.style.display == 'flex') {
        infos.style.display = 'none';
    } else {
        infos.style.display = 'flex';
    }
}


/**
 * VARIAVEIS GLOBAIS
 */
let etapaAtual = 0;
let numero = '';
let branco = true;
let votos = [];
let fim = false;


/**
 * COMEÇAR A ETAPA DE VOTAÇÃO (ETAPA 0 = VERADOR / ETAPA 1 = PREFEITO)
 */
const comecarEtapa = () => {
    atualizarRelogio();
    let etapa = etapas[etapaAtual];
    let numeroHtml = '';
    numero = '';
    branco = false;

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            numeroHtml += '<div class="numero pisca"></div>';
        } else {
            numeroHtml += '<div class="numero"></div>';
        }
    }

    seuVotoPara.style.display = 'none';
    relogioEl.style.display = 'block'; // deixa o relógio visível ao começar uma etapa
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = null;
    aviso.style.visibility = 'hidden';
    lateral.innerHTML = null;
    numeros.innerHTML = numeroHtml;
}


/**
 * ATUALIZA A INTERFACE DA URNA
 */
const atualizaInterface = () => {
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((item) => {
        if (item.numero === numero) {
            return true;
        } else {
            return false;
        }
    });

    if (candidato.length > 0) {
        candidato = candidato[0];
        seuVotoPara.style.display = 'block';
        if (etapaAtual > 0) {
            descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}<br/>Vice-Prefeito: ${candidato.vice}`;
        } else {
            descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}`;
        }

        aviso.style.visibility = 'visible';
        let fotosHtml = '';

        for (const i in candidato.fotos) {
            if (candidato.fotos[i].small) {
                fotosHtml += `<div class="imagem pequena"><img src="images/${candidato.fotos[i].url}" alt="">${candidato.fotos[i].legenda}</div>`;
            } else {
                fotosHtml += `<div class="imagem"><img src="images/${candidato.fotos[i].url}" alt="">${candidato.fotos[i].legenda}</div>`;
            }
        }
        lateral.innerHTML = fotosHtml;
    } else {
        seuVotoPara.style.display = 'block';
        aviso.style.visibility = 'visible';
        descricao.innerHTML = '<div class="descricao">NÚMERO ERRADO</div><div class="aviso--grande pisca"><br/>VOTO NULO</div>';
    }
    relogioEl.style.display = 'none';
}


/**
 * BOTÕES DO TECLADO E PISCA PISCA
 */
const clicou = (n) => {
    let elNumero = document.querySelector('.numero.pisca');
    if (elNumero !== null) {
        elNumero.innerHTML = n;
        numero = `${numero}${n}`;

        elNumero.classList.remove('pisca');
        if (elNumero.nextElementSibling !== null) {
            elNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface();
        }
    }
}


/**
 * BOTÃO PARA VOTAR EM BRANCO
 */
const votarBranco = () => {
    if (numero === '') {
        branco = true;
        seuVotoPara.style.display = 'block';
        aviso.style.visibility = 'visible';
        numeros.innerHTML = '';
        relogioEl.style.display = 'none';
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';
    } else {
        alert('Para votar em BRANCO, não pode ter digitado nenhum número!')
    }
}


/**
 * BOTÃO CORRIGIR
 */
const corrige = () => {
    if (fim == false) {
        comecarEtapa();
    } else {
        alert('Você já votou!');
    }
}


/**
 * BOTÃO CONFIRMAR
 */
const confirma = () => {
    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;

    if (fim == false) {
        if (branco === true) {
            votoConfirmado = true;
            votos.push({
                etapa: etapas[etapaAtual].titulo,
                voto: 'branco'
            });
        } else if (numero.length === etapa.numeros) {
            votoConfirmado = true;
            votos.push({
                etapa: etapas[etapaAtual].titulo,
                voto: numero
            });
        }
        if (votoConfirmado) {
            etapaAtual++;

            if (etapaAtual == 1) {
                let audioEnter = new Audio(AUDIO_PROXIMA_ETAPA);
                audioEnter.play();
            }

            if (etapas[etapaAtual] !== undefined) {
                comecarEtapa();
            } else {
                telaFim();
            }
        }
    } else {
        alert('Você já votou!');
    }
}

const telaFim = () => {
    fim = true;
    let fimHTML = '<div class="tela-fim"><div class="fim-superior"><div class="treinamento">TREINAMENTO FINALIZADO</div></div>'
    +'<div class="fim">FIM</div><div class="fim-inferior"><div class="votou">VOTOU</div></div></div>';
    let audioFim = new Audio(AUDIO_FIM);
    
    document.querySelector('.ue-tela').innerHTML = fimHTML;
    audioFim.play();
    console.log(votos);
}


/**
 * INICIAR O CÓDIGO
 */
comecarEtapa();