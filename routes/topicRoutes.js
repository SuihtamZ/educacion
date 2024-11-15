const express = require('express');
const router = express.Router();
const topicsController = require('../controllers/topicController'); // Importa el controlador de temas

// Rutas y métodos correspondientes
router.get('/', topicsController.showAllTopics); // Ruta para mostrar todos los temas
router.get('/add', topicsController.showAddTopicForm); // Ruta para mostrar el formulario de agregar
router.post('/add', topicsController.addTopic); // Ruta para agregar un nuevo tema
router.get('/edit/:id', topicsController.showEditTopicForm); // Ruta para mostrar el formulario de edición
router.post('/edit/:id', topicsController.updateTopic); // Ruta para actualizar un tema
router.post('/delete/:id', topicsController.deleteTopic); // Ruta para eliminar un tema
router.post('/vote', topicsController.voteTopic); // Ruta para votar por un tema o enlace
router.post('/upvote/:id', topicsController.upvoteTopic);
router.post('/:id/links/add', topicsController.addLink); //Ruta para agregar un link
router.post('/:id/links/:linkId/vote', topicsController.voteLink);

module.exports = router;