// Clinic Management System JavaScript

// Global variables
let patients = JSON.parse(localStorage.getItem('patients')) || [];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let doctors = JSON.parse(localStorage.getItem('doctors')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadDashboardData();
    setupEventListeners();
    populateDropdowns();
});

// Initialize the application
function initializeApp() {
    // Add some sample data if empty
    if (patients.length === 0) {
        addSamplePatients();
    }
    if (doctors.length === 0) {
        addSampleDoctors();
    }
    if (appointments.length === 0) {
        addSampleAppointments();
    }
    
    // Update all displays
    updatePatientsTable();
    updateAppointmentsTable();
    updateDoctorsTable();
    loadDashboardData();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-links li').forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Mobile menu toggle
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Search functionality
    document.getElementById('patient-search').addEventListener('input', filterPatients);
    document.getElementById('appointment-search').addEventListener('input', filterAppointments);
    document.getElementById('doctor-search').addEventListener('input', filterDoctors);

    // Form submissions
    document.getElementById('add-patient-form').addEventListener('submit', handleAddPatient);
    document.getElementById('add-appointment-form').addEventListener('submit', handleAddAppointment);
    document.getElementById('add-doctor-form').addEventListener('submit', handleAddDoctor);

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.nav-links li').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName).classList.add('active');

    // Add active class to selected nav link
    document.querySelector([data-section="${sectionName}"]).classList.add('active');

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'patients': 'Patient Management',
        'appointments': 'Appointment Management',
        'doctors': 'Doctor Management'
    };
    document.getElementById('page-title').textContent = titles[sectionName];

    // Close mobile sidebar
    document.querySelector('.sidebar').classList.remove('active');
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    populateDropdowns();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Reset form
    document.querySelector(#${modalId} form).reset();
}

// Populate dropdowns
function populateDropdowns() {
    // Populate patient dropdown
    const patientSelect = document.getElementById('appointment-patient');
    patientSelect.innerHTML = '<option value="">Select Patient</option>';
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        patientSelect.appendChild(option);
    });

    // Populate doctor dropdown
    const doctorSelect = document.getElementById('appointment-doctor');
    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = ${doctor.name} (${doctor.specialization});
        doctorSelect.appendChild(option);
    });
}

// Form handlers
function handleAddPatient(event) {
    event.preventDefault();
    
    const patient = {
        id: generateId(),
        name: document.getElementById('patient-name').value,
        age: parseInt(document.getElementById('patient-age').value),
        gender: document.getElementById('patient-gender').value,
        phone: document.getElementById('patient-phone').value,
        email: document.getElementById('patient-email').value,
        address: document.getElementById('patient-address').value,
        createdAt: new Date().toISOString()
    };

    patients.push(patient);
    saveData('patients', patients);
    updatePatientsTable();
    loadDashboardData();
    closeModal('add-patient-modal');
    showMessage('Patient added successfully!', 'success');
}

function handleAddAppointment(event) {
    event.preventDefault();
    
    const appointment = {
        id: generateId(),
        patientId: document.getElementById('appointment-patient').value,
        doctorId: document.getElementById('appointment-doctor').value,
        date: document.getElementById('appointment-date').value,
        time: document.getElementById('appointment-time').value,
        reason: document.getElementById('appointment-reason').value,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };

    appointments.push(appointment);
    saveData('appointments', appointments);
    updateAppointmentsTable();
    loadDashboardData();
    closeModal('add-appointment-modal');
    showMessage('Appointment booked successfully!', 'success');
}

function handleAddDoctor(event) {
    event.preventDefault();
    
    const doctor = {
        id: generateId(),
        name: document.getElementById('doctor-name').value,
        specialization: document.getElementById('doctor-specialization').value,
        phone: document.getElementById('doctor-phone').value,
        email: document.getElementById('doctor-email').value,
        schedule: document.getElementById('doctor-schedule').value,
        createdAt: new Date().toISOString()
    };

    doctors.push(doctor);
    saveData('doctors', doctors);
    updateDoctorsTable();
    loadDashboardData();
    closeModal('add-doctor-modal');
    showMessage('Doctor added successfully!', 'success');
}

// Table update functions
function updatePatientsTable() {
    const tbody = document.getElementById('patients-tbody');
    tbody.innerHTML = '';

    if (patients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No patients found</h3>
                    <p>Add your first patient to get started</p>
                </td>
            </tr>
        `;
        return;
    }

    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.phone}</td>
            <td>${patient.email}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-secondary" onclick="editPatient('${patient.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deletePatient('${patient.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateAppointmentsTable() {
    const tbody = document.getElementById('appointments-tbody');
    tbody.innerHTML = '';

    if (appointments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>No appointments found</h3>
                    <p>Book your first appointment to get started</p>
                </td>
            </tr>
        `;
        return;
    }

    appointments.forEach(appointment => {
        const patient = patients.find(p => p.id === appointment.patientId);
        const doctor = doctors.find(d => d.id === appointment.doctorId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${patient ? patient.name : 'Unknown'}</td>
            <td>${doctor ? doctor.name : 'Unknown'}</td>
            <td>${formatDate(appointment.date)}</td>
            <td>${appointment.time}</td>
            <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-success" onclick="updateAppointmentStatus('${appointment.id}', 'completed')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteAppointment('${appointment.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateDoctorsTable() {
    const tbody = document.getElementById('doctors-tbody');
    tbody.innerHTML = '';

    if (doctors.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-user-md"></i>
                    <h3>No doctors found</h3>
                    <p>Add your first doctor to get started</p>
                </td>
            </tr>
        `;
        return;
    }

    doctors.forEach(doctor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doctor.id}</td>
            <td>${doctor.name}</td>
            <td>${doctor.specialization}</td>
            <td>${doctor.phone}</td>
            <td>${doctor.email}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-secondary" onclick="editDoctor('${doctor.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteDoctor('${doctor.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Dashboard functions
function loadDashboardData() {
    // Update statistics
    document.getElementById('total-patients').textContent = patients.length;
    document.getElementById('total-doctors').textContent = doctors.length;
    
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(apt => apt.date === today);
    document.getElementById('total-appointments').textContent = todaysAppointments.length;
    
    const pendingAppointments = appointments.filter(apt => apt.status === 'scheduled');
    document.getElementById('pending-appointments').textContent = pendingAppointments.length;

    // Update recent appointments
    updateRecentAppointments();
}

function updateRecentAppointments() {
    const recentList = document.getElementById('recent-appointments-list');
    const recentAppointments = appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    if (recentAppointments.length === 0) {
        recentList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-alt"></i>
                <h3>No recent appointments</h3>
                <p>Book appointments to see them here</p>
            </div>
        `;
        return;
    }

    recentList.innerHTML = '';
    recentAppointments.forEach(appointment => {
        const patient = patients.find(p => p.id === appointment.patientId);
        const doctor = doctors.find(d => d.id === appointment.doctorId);
        
        const item = document.createElement('div');
        item.className = 'appointment-item';
        item.innerHTML = `
            <div class="appointment-info">
                <h4>${patient ? patient.name : 'Unknown Patient'}</h4>
                <p>${doctor ? doctor.name : 'Unknown Doctor'} • ${formatDate(appointment.date)} ${appointment.time}</p>
            </div>
            <span class="status-badge status-${appointment.status}">${appointment.status}</span>
        `;
        recentList.appendChild(item);
    });
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = message ${type};
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Insert at the top of the content area
    const content = document.querySelector('.content');
    content.insertBefore(messageDiv, content.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Filter functions
function filterPatients() {
    const searchTerm = document.getElementById('patient-search').value.toLowerCase();
    const rows = document.querySelectorAll('#patients-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterAppointments() {
    const searchTerm = document.getElementById('appointment-search').value.toLowerCase();
    const rows = document.querySelectorAll('#appointments-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterDoctors() {
    const searchTerm = document.getElementById('doctor-search').value.toLowerCase();
    const rows = document.querySelectorAll('#doctors-tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Delete functions
function deletePatient(patientId) {
    if (confirm('Are you sure you want to delete this patient?')) {
        patients = patients.filter(p => p.id !== patientId);
        saveData('patients', patients);
        updatePatientsTable();
        loadDashboardData();
        showMessage('Patient deleted successfully!', 'success');
    }
}

function deleteAppointment(appointmentId) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        appointments = appointments.filter(a => a.id !== appointmentId);
        saveData('appointments', appointments);
        updateAppointmentsTable();
        loadDashboardData();
        showMessage('Appointment deleted successfully!', 'success');
    }
}

function deleteDoctor(doctorId) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        doctors = doctors.filter(d => d.id !== doctorId);
        saveData('doctors', doctors);
        updateDoctorsTable();
        loadDashboardData();
        showMessage('Doctor deleted successfully!', 'success');
    }
}

// Update appointment status
function updateAppointmentStatus(appointmentId, status) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = status;
        saveData('appointments', appointments);
        updateAppointmentsTable();
        loadDashboardData();
        showMessage(Appointment marked as ${status}!, 'success');
    }
}

// Sample data functions
function addSamplePatients() {
    const samplePatients = [
        {
            id: generateId(),
            name: 'John Doe',
            age: 35,
            gender: 'Male',
            phone: '+1-555-0123',
            email: 'john.doe@email.com',
            address: '123 Main St, City, State',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Jane Smith',
            age: 28,
            gender: 'Female',
            phone: '+1-555-0124',
            email: 'jane.smith@email.com',
            address: '456 Oak Ave, City, State',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Mike Johnson',
            age: 42,
            gender: 'Male',
            phone: '+1-555-0125',
            email: 'mike.johnson@email.com',
            address: '789 Pine Rd, City, State',
            createdAt: new Date().toISOString()
        }
    ];
    patients = samplePatients;
    saveData('patients', patients);
}

function addSampleDoctors() {
    const sampleDoctors = [
        {
            id: generateId(),
            name: 'Dr. Sarah Wilson',
            specialization: 'Cardiology',
            phone: '+1-555-0101',
            email: 'sarah.wilson@clinic.com',
            schedule: 'Monday-Friday: 9 AM - 5 PM',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Dr. Robert Chen',
            specialization: 'Dermatology',
            phone: '+1-555-0102',
            email: 'robert.chen@clinic.com',
            schedule: 'Monday-Thursday: 10 AM - 6 PM',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Dr. Emily Davis',
            specialization: 'Pediatrics',
            phone: '+1-555-0103',
            email: 'emily.davis@clinic.com',
            schedule: 'Tuesday-Saturday: 8 AM - 4 PM',
            createdAt: new Date().toISOString()
        }
    ];
    doctors = sampleDoctors;
    saveData('doctors', doctors);
}

function addSampleAppointments() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const sampleAppointments = [
        {
            id: generateId(),
            patientId: patients[0]?.id,
            doctorId: doctors[0]?.id,
            date: today.toISOString().split('T')[0],
            time: '10:00',
            reason: 'Regular checkup',
            status: 'scheduled',
            createdAt:
