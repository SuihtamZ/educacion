// controllers/topicsController.js
const { Topic } = require('../models/topicModel');
const { v4: uuidv4 } = require('uuid'); // Para generar IDs únicos para los enlaces

// Votar por un tema o enlace
exports.voteTopic = (req, res) => {
    const { topicId, linkId } = req.body;
    const topic = Topic.findTopicById(parseInt(topicId));

    if (topic) {
        if (linkId) {
            topic.upvoteLink(parseInt(linkId));
        } else {
            topic.upvote();
        }
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: "Topic not found" });
    }
};

// Función para votar por un tema
exports.upvoteTopic = (req, res) => {
    const topicId = req.params.id;
    
    // Obtenemos todos los temas y verificamos su contenido para depuración
    const allTopics = Topic.getAllTopics();
    console.log("Contenido de todos los temas:", allTopics);

    const topic = Topic.findTopicById(topicId);

    if (topic) {
        topic.upvote(); // Incrementa los votos del tema
        res.redirect('/topics'); // Redirige a la lista de temas actualizada
    } else {
        console.error(`Tema con ID ${topicId} no encontrado en el array de topics`);
        res.status(404).send('Tema no encontrado');
    }
};

// Mostrar todos los temas (ordenados por votos)
exports.showAllTopics = (req, res) => {
    try {
        // En lugar de Topic.find(), utilizamos Topic.getAllTopics() para obtener todos los temas
        const topics = Topic.getAllTopics();
        res.render('topics/list', { topics });
    } catch (err) {
        res.status(500).send('Error al obtener los temas.');
    }
};

// Mostrar formulario para agregar un nuevo tema
exports.showAddTopicForm = (req, res) => {
    res.render('topics/add');
};

// Agregar un nuevo tema
exports.addTopic = (req, res) => {
    const { title, description, url } = req.body;
    const newTopic = new Topic(uuidv4(), title, description);
    Topic.addTopic(newTopic);
    // Si se ha proporcionado una URL, agregar un enlace al nuevo tema
    if (url && url.trim() !== '') {
        const newLink = {
            id: uuidv4(),  // Generar un ID único para el enlace
            url: url,
            votes: 0
        };
        newTopic.addLink(newLink);
    }
    res.redirect('/topics');
};

// Mostrar formulario para editar un tema
exports.showEditTopicForm = (req, res) => {
    const topic = Topic.findTopicById(req.params.id);
    if (topic) {
        res.render('topics/edit', { topic });
    } else {
        res.status(404).json({ success: false, message: 'Tema no encontrado' });
    }
};

// Agregar un enlace
exports.addLink = (req, res) => {
    const topicId = req.params.id;
    const topic = Topic.findTopicById(topicId);
    if (topic) {
        // Crear el nuevo enlace con una URL y votos inicializados a 0
        const newLink = {
            id: uuidv4(),  // Generar un ID único para el enlace
            url: req.body.url,
            votes: 0
        };

        // Añadir el enlace al array de enlaces del tema encontrado
        topic.addLink(newLink);

        // Redirigir a la lista de temas después de agregar el enlace
        res.redirect('/topics');
    } else {
        res.status(404).send('Tema no encontrado.');
    }
};

// Función para votar por un enlace específico
exports.voteLink = (req, res) => {
    const topicId = req.params.id; // ID del tema
    const linkId = req.params.linkId; // ID del enlace

    // Obtenemos el tema específico por ID
    const topic = Topic.findTopicById(topicId);
    if (topic) {
        // Buscar el enlace dentro del tema
        const link = topic.links.find(l => l.id === linkId);
        
        if (link) {
            link.votes += 1; // Incrementa los votos del enlace
            res.redirect('/topics'); // Redirige a la lista de temas actualizada
        } else {
            console.error(`Enlace con ID ${linkId} no encontrado en el tema con ID ${topicId}`);
            res.status(404).send('Enlace no encontrado.');
        }
    } else {
        console.error(`Tema con ID ${topicId} no encontrado`);
        res.status(404).send('Tema no encontrado.');
    }
};

// Actualizar un tema
exports.updateTopic = (req, res) => {
    const { title, description, links } = req.body;
    Topic.updateTopic(req.params.id, title, description, links); 
    res.redirect('/topics'); // Redirige a la lista después de la actualización
};

// Eliminar un tema
exports.deleteTopic = (req, res) => {
    Topic.deleteTopic(req.params.id);
    res.redirect('/topics');
};

// Mostrar temas y enlaces ordenados por votos
exports.getTopics = (req, res) => {
    const topics = Topic.getAllTopics();
    topics.forEach(topic => {
        topic.links = topic.getSortedLinks(); // Utilizar getSortedLinks para ordenar enlaces
    });
    res.render('topics/list', { topics });
};