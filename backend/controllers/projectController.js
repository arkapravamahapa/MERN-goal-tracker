const Project = require('../models/projectModel');

// @desc    Get all projects (timesheet rows)
// @route   GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a new project row
// @route   POST /api/projects
const addProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name || 'New Project',
      color: req.body.color || 'bg-blue-500',
      hours: ['', '', '', '', '', '', '']
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update project hours
// @route   PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
};