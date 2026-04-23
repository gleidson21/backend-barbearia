import * as Yup from 'yup';
import Service from '../models/Services.js';

class ServiceController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      duration: Yup.number().required(),
    });

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({
        error: 'Dados inválidos.',
      });
    }

    const service = await Service.create(req.body);

    return res.status(201).json(service);
  }

  async index(_req, res) {
    const services = await Service.findAll();

    return res.json(services);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      duration: Yup.number(),
    });

    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return res.status(400).json({
        error: 'Dados inválidos.',
      });
    }

    const { id } = req.params;

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({
        error: 'Serviço não encontrado.',
      });
    }

    const updatedService = await service.update(req.body);

    return res.json(updatedService);
  }

  async delete(req, res) {
    const { id } = req.params;

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({
        error: 'Serviço não encontrado.',
      });
    }

    await service.destroy();

    return res.status(200).json({
      message: 'Serviço deletado com sucesso.',
    });
  }
}

export default new ServiceController();