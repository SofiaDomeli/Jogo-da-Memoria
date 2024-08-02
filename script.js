const seletores = {
    tabuleiroContainer : document.querySelector('.tabuleiro-container'),
    tabuleiro : document.querySelector('.tabuleiro'),
    movimentos : document.querySelector('.movimentos'),
    tempo : document.querySelector('.tempo'),
    inicio : document.querySelector('button'),
    vitoria : document.querySelector('.vitoria')
};

const estado = {
    jogoIniciado: false,
    cartasViradas: 0,
    totalViradas: 0,
    totalTempo: 0,
    loop: null,
};

const embaralhar = array => {
    const arrayCopiado = [...array]

    for (let i = arrayCopiado.length - 1; i > 0; i--) {
        const indexAleatorio = Math.floor(Math.random() * (i + 1))
        const original = arrayCopiado[i]

        arrayCopiado[i] = arrayCopiado[indexAleatorio]
        arrayCopiado[indexAleatorio] = original
    }

    return arrayCopiado
};

const selecionarAleatorio = (array, items) => {
    const arrayCopiado = [...array]
    const selecaoAleatoria = []

    for (let i = 0; i < items; i++) {
        const indexAleatorio = Math.floor(Math.random() * arrayCopiado.length)

        selecaoAleatoria.push(arrayCopiado[indexAleatorio])
        arrayCopiado.splice(indexAleatorio, 1)
    }
    
    return selecaoAleatoria
};

const gerarJogo = () => {
    const dimensoes = seletores.tabuleiro.getAttribute('data-dimension')
    if (dimensoes % 2 !== 0) {
        throw new Error("A dimensão do tabuleiro deve ser um número par!")
    }

    const emojis = ['🐻‍❄️', '🪼', '🐼', '🐈‍⬛', '🐆', '🐬', '🐳', '🦉', '🦢', '🦊']
    const escolhas = selecionarAleatorio(emojis, (dimensoes * dimensoes) / 2)
    const itens = embaralhar([...escolhas, ...escolhas])
    const cartas = `
        <div class="tabuleiro" style="grid-template-columns: repeat(${dimensoes}, auto)">
            ${itens.map(item => `
                <div class="card">
                    <div class="card-frente"></div>
                    <div class="card-atras">${item}</div>
                </div>
            `).join('')}
        </div>
    `

    const parser = new DOMParser().parseFromString(cartas, 'text/html')

    seletores.tabuleiro.replaceWith(parser.querySelector('.tabuleiro'))
};

const iniciarJogo = () => {
    estado.jogoIniciado = true
    seletores.inicio.classList.add('disabled')

    estado.loop = setInterval(() => {
        estado.totalTempo++

        seletores.movimentos.innerText = `${estado.totalViradas} jogadas`
        seletores.tempo.innerText = `${estado.totalTempo} segundos`
    }, 1000)
}

const virarCartaVirada = () => {
    document.querySelectorAll('.card:not(.matched').forEach(card => {
        card.classList.remove('flipped')
    })

    estado.cartasViradas = 0
};

const virarCarta = card => {
    estado.cartasViradas++
    estado.totalViradas++

    if (!estado.jogoIniciado){
        iniciarJogo()
    }

    if (estado.cartasViradas <= 2) {
        card.classList.add('flipped')
    }

    if (estado.cartasViradas === 2) {
        const cartasViradas = document.querySelectorAll('.flipped:not(.matched)')

        if (cartasViradas[0].innerText === cartasViradas[1].innerText) {
            cartasViradas[0].classList.add('matched')
            cartasViradas[1].classList.add('matched')
        }

        setTimeout(() => {
            virarCartaVirada()
        }, 1000)
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            seletores.tabuleiroContainer.classList.add('flipped')
            seletores.vitoria.innerHTML = `
                <span class="texto-vitoria">
                    Você Venceu!<br />
                    em <span class="iluminador">${estado.totalViradas}</span> movimentos<br />
                    e <span class="iluminador">${estado.totalTempo}</span> segundos
                </span>
                <button style="margin-top: 55%" onclick="location.reload()">Jogar Novamente</button>
            `

            clearInterval(estado.loop)
        }, 1000)
    }
};

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            virarCarta(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            iniciarJogo()
        }
    })
};

gerarJogo();
attachEventListeners()
