Feature: Playlists de usuarios

Scenario: criar uma playlist
Given estou no menu de usuário
When clico na opção de criar uma playlist
And coloco as informações básicas da playlist
Then possuo uma playlist nova vazia

Scenario: adicionar a playlist
Given tenho um filme interessante
When ciclo na opção de adicionar a playlist
And escolho a qual playlist adicionar
Then vejo uma mensagem avisando que foi adicionado a playlist

Scenario: erro ao criar playlist
Given estou na opção de criar uma playlist
When não coloco o nome da playlist
And clico em enviar
Then recebo uma mensagem erro por não colocar o nome 
And a playlist não é criada

Scenario: adicionar um filme que já está na playlist
Given vejo um filme interessante
When clico para adicionar o filme a uma playlist existente
And não lembro que esse filme já está na playlist
Then recebo uma mensagem de erro comunicando que o filme já está na playlist
And volto para a página anterior