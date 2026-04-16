Feature: Playlists de usuarios

Scenario: autoavaliação bem sucedida
Given estou na página de autoavaliação
And vejo que os conceitos da parte de autoavaliação não foram inseridas
When eu adiciono os meus conceitos na parte de autoavaliação
And clico em salvar
Then vejo uma tela informando que os conceitos foram salvos 
And posso retornar ao menu

Scenario: autoavaliação mal sucedida
Given estou na página de autoavaliação
And vejo que as notas da parte de autoavaliação não foram inseridas
When adiciono algumas das notas, mas não todas 
And clico em salvar
Then vejo uma mensagem informando que a autoavaliação não foi visualizada
And tenho que terminar de colocar todas as notas para salvar
And tenho a opção de voltar a colocar as notas
And tenho a opção de sair sem salvar
