/**
 * BM Rochas - recebimento de leads da landing page
 *
 * COMO INSTALAR
 * 1. Crie uma planilha nova no Google Sheets.
 * 2. Extensões > Apps Script. Apague o conteúdo e cole este arquivo inteiro.
 * 3. Troque o valor de SHEET_ID abaixo pelo ID da sua planilha
 *    (está na URL: docs.google.com/spreadsheets/d/ESTE_TRECHO_AQUI/edit).
 * 4. Salve. Depois clique em Implantar > Nova implantação.
 *    Tipo: App da Web. Executar como: Eu. Quem tem acesso: Qualquer pessoa.
 * 5. Autorize quando ele pedir (vai aparecer aviso de app não verificado, é normal,
 *    clique em Avançado > Acessar projeto).
 * 6. Copie a URL gerada (termina em /exec) e cole na constante ENDPOINT
 *    dentro do index.html, no final do script.
 *
 * Se depois você alterar este código, precisa fazer Implantar > Gerenciar implantações
 * > editar > Nova versão, senão a URL continua rodando o código antigo.
 */

const SHEET_ID  = 'COLE_O_ID_DA_PLANILHA_AQUI';
const ABA       = 'Leads';
const AVISAR    = '';  // opcional: coloque um e-mail para receber aviso a cada lead

const COLUNAS = ['Data', 'Nome', 'WhatsApp', 'Cidade', 'Fase da obra', 'Ambiente', 'Origem'];

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const aba = pegarAba_();

    aba.appendRow([
      formatarData_(dados.data),
      dados.nome     || '',
      dados.whatsapp || '',
      dados.cidade   || '',
      dados.fase     || '',
      dados.ambiente || '',
      dados.origem   || ''
    ]);

    if (AVISAR) {
      MailApp.sendEmail({
        to: AVISAR,
        subject: 'Novo lead no site: ' + (dados.nome || 'sem nome'),
        body: [
          'Nome: '     + dados.nome,
          'WhatsApp: ' + dados.whatsapp,
          'Cidade: '   + dados.cidade,
          'Fase: '     + dados.fase,
          'Ambiente: ' + dados.ambiente
        ].join('\n')
      });
    }

    return resposta_({ ok: true });
  } catch (erro) {
    console.error(erro);
    return resposta_({ ok: false, erro: String(erro) });
  }
}

// Permite testar a URL no navegador. Se abrir e mostrar {"ok":true}, está no ar.
function doGet() {
  return resposta_({ ok: true, servico: 'BM Rochas - leads' });
}

function pegarAba_() {
  const planilha = SpreadsheetApp.openById(SHEET_ID);
  let aba = planilha.getSheetByName(ABA);

  if (!aba) {
    aba = planilha.insertSheet(ABA);
  }

  if (aba.getLastRow() === 0) {
    aba.appendRow(COLUNAS);
    aba.getRange(1, 1, 1, COLUNAS.length)
       .setFontWeight('bold')
       .setBackground('#15171A')
       .setFontColor('#EFECE6');
    aba.setFrozenRows(1);
    aba.setColumnWidth(1, 150);
    aba.setColumnWidth(2, 200);
    aba.setColumnWidth(7, 260);
  }

  return aba;
}

function formatarData_(iso) {
  const d = iso ? new Date(iso) : new Date();
  return Utilities.formatDate(d, 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm');
}

function resposta_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
