let topics = []; // Base de datos simulada en forma de array

// Modelo para un enlace dentro de un tema
class Link {
  constructor(id, url, votes = 0) {
    this.id = id;
    this.url = url;
    this.votes = votes;
  }
}

// Modelo para un tema de aprendizaje
class Topic {
  constructor(id, title, description, votes = 0) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.votes = votes;
    this.links = [];
  }

  // Función para agregar un nuevo enlace al tema
  addLink(link) {
    this.links.push(link);
  }

  // Función para votar por un tema
  upvote() {
    this.votes += 1;
  }

  // Función para votar por un enlace específico
  upvoteLink(linkId) {
    const link = this.links.find(link => link.id === linkId);
    if (link) link.votes += 1;
  }

  // Función estática para agregar un nuevo tema
  static addTopic(topic) {
    topics.push(topic);
  }

  // Función para obtener enlaces ordenados por votos
  getSortedLinks() {
    return this.links.sort((a, b) => b.votes - a.votes);
  }
  
  // Función estática para obtener todos los temas, ordenados por votos
  static getAllTopics() {
    return topics.sort((a, b) => b.votes - a.votes);
  }

  // Función estática para encontrar un tema por ID
  static findTopicById(id) {
    return topics.find(topic => topic.id === id);
  }

// Función estática para actualizar un tema
static updateTopic(id, title, description, links) {
    const topic = Topic.findTopicById(id);
    if (topic) {
        topic.title = title;
        topic.description = description;

        // Actualizar enlaces existentes y agregar nuevos enlaces sin duplicados ni vacíos
        if (links && Array.isArray(links)) {
            links.forEach(linkData => {
                if (linkData.url && linkData.id) {  // Asegurarse de que el enlace tiene un URL válido y un ID
                    const existingLink = topic.links.find(l => l.id === linkData.id);
                    if (existingLink) {
                        // Si el enlace ya existe, actualiza solo su URL si ha cambiado
                        if (existingLink.url !== linkData.url) {
                            existingLink.url = linkData.url;
                        }
                    } else {
                        // Si es un nuevo enlace, agrégalo a la lista de enlaces del tema
                        topic.links.push(new Link(linkData.id, linkData.url, linkData.votes || 0));
                    }
                }
            });

            // Filtrar enlaces vacíos en caso de que se hayan quedado
            topic.links = topic.links.filter(link => link.url);
        }
    }
}

  // Función estática para eliminar un tema
  static deleteTopic(id) {
    topics = topics.filter(topic => topic.id !== id);
  }
}

module.exports = { Topic, Link };