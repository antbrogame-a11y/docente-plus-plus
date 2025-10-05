/**
 * Integration Tests for Docente++
 * 
 * These tests can be run in the browser console to verify
 * runtime integration between all macro-functionalities.
 * 
 * Usage:
 * 1. Open index.html in browser
 * 2. Open developer console
 * 3. Copy and paste this file content
 * 4. Run: runIntegrationTests()
 */

const IntegrationTests = {
    results: [],
    
    // Helper methods
    log(message, type = 'info') {
        const prefix = {
            'info': 'ℹ️',
            'success': '✅',
            'error': '❌',
            'warning': '⚠️'
        }[type];
        console.log(`${prefix} ${message}`);
    },
    
    assert(condition, testName) {
        if (condition) {
            this.log(`PASS: ${testName}`, 'success');
            this.results.push({ test: testName, passed: true });
            return true;
        } else {
            this.log(`FAIL: ${testName}`, 'error');
            this.results.push({ test: testName, passed: false });
            return false;
        }
    },
    
    // Data structure tests
    testDataStructures() {
        console.log('\n🧪 Testing Data Structures...\n');
        
        // Test localStorage keys
        const expectedKeys = [
            'openrouter-api-key',
            'openrouter-model-id', 
            'teacher-name',
            'school-name',
            'school-year',
            'active-class',
            'docente-plus-lessons',
            'docente-plus-students'
        ];
        
        // Test app instance exists
        this.assert(
            typeof app !== 'undefined',
            'App instance exists'
        );
        
        // Test app has required properties
        this.assert(
            app.hasOwnProperty('lessons') && Array.isArray(app.lessons),
            'App has lessons array'
        );
        
        this.assert(
            app.hasOwnProperty('students') && Array.isArray(app.students),
            'App has students array'
        );
        
        this.assert(
            app.hasOwnProperty('activeClass'),
            'App has activeClass property'
        );
        
        // Test lesson structure (if lessons exist)
        if (app.lessons.length > 0) {
            const lesson = app.lessons[0];
            const hasRequiredFields = 
                lesson.hasOwnProperty('id') &&
                lesson.hasOwnProperty('title') &&
                lesson.hasOwnProperty('subject') &&
                lesson.hasOwnProperty('date') &&
                lesson.hasOwnProperty('createdAt');
            
            this.assert(
                hasRequiredFields,
                'Lesson structure has required fields'
            );
        }
        
        // Test student structure (if students exist)
        if (app.students.length > 0) {
            const student = app.students[0];
            const hasRequiredFields =
                student.hasOwnProperty('id') &&
                student.hasOwnProperty('name') &&
                student.hasOwnProperty('createdAt');
            
            this.assert(
                hasRequiredFields,
                'Student structure has required fields'
            );
        }
    },
    
    // Configuration tests
    testConfiguration() {
        console.log('\n⚙️ Testing Configuration...\n');
        
        // Test settings methods exist
        this.assert(
            typeof app.saveSettings === 'function',
            'saveSettings method exists'
        );
        
        this.assert(
            typeof app.loadSettings === 'function',
            'loadSettings method exists'
        );
        
        this.assert(
            typeof app.verifyAPIKey === 'function',
            'verifyAPIKey method exists'
        );
        
        // Test class management
        this.assert(
            typeof app.setActiveClass === 'function',
            'setActiveClass method exists'
        );
        
        this.assert(
            typeof app.loadActiveClass === 'function',
            'loadActiveClass method exists'
        );
    },
    
    // Lesson management tests
    testLessonManagement() {
        console.log('\n📚 Testing Lesson Management...\n');
        
        this.assert(
            typeof app.showAddLessonForm === 'function',
            'showAddLessonForm method exists'
        );
        
        this.assert(
            typeof app.addLesson === 'function',
            'addLesson method exists'
        );
        
        this.assert(
            typeof app.deleteLesson === 'function',
            'deleteLesson method exists'
        );
        
        this.assert(
            typeof app.renderLessons === 'function',
            'renderLessons method exists'
        );
        
        this.assert(
            typeof app.generateLessonWithAI === 'function',
            'generateLessonWithAI method exists'
        );
        
        // Test lesson form elements exist
        this.assert(
            document.getElementById('lesson-title') !== null,
            'Lesson title input exists'
        );
        
        this.assert(
            document.getElementById('lesson-subject') !== null,
            'Lesson subject input exists'
        );
        
        this.assert(
            document.getElementById('lesson-date') !== null,
            'Lesson date input exists'
        );
    },
    
    // Student management tests
    testStudentManagement() {
        console.log('\n👥 Testing Student Management...\n');
        
        this.assert(
            typeof app.showAddStudentForm === 'function',
            'showAddStudentForm method exists'
        );
        
        this.assert(
            typeof app.addStudent === 'function',
            'addStudent method exists'
        );
        
        this.assert(
            typeof app.deleteStudent === 'function',
            'deleteStudent method exists'
        );
        
        this.assert(
            typeof app.renderStudents === 'function',
            'renderStudents method exists'
        );
        
        // Test student form elements exist
        this.assert(
            document.getElementById('student-name') !== null,
            'Student name input exists'
        );
        
        this.assert(
            document.getElementById('student-email') !== null,
            'Student email input exists'
        );
        
        this.assert(
            document.getElementById('student-class') !== null,
            'Student class input exists'
        );
    },
    
    // AI Assistant tests
    testAIAssistant() {
        console.log('\n🤖 Testing AI Assistant...\n');
        
        this.assert(
            typeof app.sendAIMessage === 'function',
            'sendAIMessage method exists'
        );
        
        this.assert(
            typeof app.callOpenRouterAPI === 'function',
            'callOpenRouterAPI method exists'
        );
        
        this.assert(
            typeof app.addChatMessage === 'function',
            'addChatMessage method exists'
        );
        
        this.assert(
            typeof app.quickAIPrompt === 'function',
            'quickAIPrompt method exists'
        );
        
        // Test AI elements exist
        this.assert(
            document.getElementById('ai-input') !== null,
            'AI input textarea exists'
        );
        
        this.assert(
            document.getElementById('chat-messages') !== null,
            'Chat messages container exists'
        );
        
        // Test file upload
        this.assert(
            typeof app.handleFileSelect === 'function',
            'handleFileSelect method exists'
        );
    },
    
    // UI/Navigation tests
    testUINavigation() {
        console.log('\n🎨 Testing UI and Navigation...\n');
        
        // Test tab switching
        this.assert(
            typeof app.switchTab === 'function',
            'switchTab method exists'
        );
        
        // Test all tabs exist
        const tabs = ['dashboard', 'lessons', 'students', 'ai-assistant', 'settings'];
        tabs.forEach(tab => {
            this.assert(
                document.getElementById(tab) !== null,
                `Tab "${tab}" exists`
            );
        });
        
        // Test dashboard elements
        this.assert(
            document.getElementById('lesson-count') !== null,
            'Lesson count element exists'
        );
        
        this.assert(
            document.getElementById('student-count') !== null,
            'Student count element exists'
        );
        
        this.assert(
            document.getElementById('ai-status') !== null,
            'AI status element exists'
        );
        
        this.assert(
            document.getElementById('active-class-selector') !== null,
            'Active class selector exists'
        );
    },
    
    // Data persistence tests
    testDataPersistence() {
        console.log('\n💾 Testing Data Persistence...\n');
        
        this.assert(
            typeof app.saveData === 'function',
            'saveData method exists'
        );
        
        this.assert(
            typeof app.loadData === 'function',
            'loadData method exists'
        );
        
        this.assert(
            typeof app.exportData === 'function',
            'exportData method exists'
        );
        
        this.assert(
            typeof app.importData === 'function',
            'importData method exists'
        );
    },
    
    // Context integration tests
    testContextIntegration() {
        console.log('\n🔗 Testing Context Integration...\n');
        
        // Test that class context is available
        const hasClassContext = app.activeClass !== undefined;
        this.assert(
            hasClassContext,
            'Active class context available'
        );
        
        // Test that settings can be retrieved
        const apiKey = localStorage.getItem('openrouter-api-key');
        this.assert(
            apiKey !== undefined,
            'API key can be retrieved from localStorage'
        );
        
        const schoolYear = localStorage.getItem('school-year');
        this.assert(
            schoolYear !== undefined,
            'School year can be retrieved from localStorage'
        );
        
        // Test dashboard rendering
        this.assert(
            typeof app.renderDashboard === 'function',
            'renderDashboard method exists'
        );
    },
    
    // Run all tests
    runAll() {
        console.clear();
        console.log('🚀 Starting Docente++ Integration Tests\n');
        console.log('=' .repeat(60));
        
        this.results = [];
        
        this.testDataStructures();
        this.testConfiguration();
        this.testLessonManagement();
        this.testStudentManagement();
        this.testAIAssistant();
        this.testUINavigation();
        this.testDataPersistence();
        this.testContextIntegration();
        
        console.log('\n' + '='.repeat(60));
        console.log('\n📊 Test Results Summary\n');
        
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const total = this.results.length;
        const percentage = ((passed / total) * 100).toFixed(1);
        
        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${percentage}%`);
        
        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results
                .filter(r => !r.passed)
                .forEach(r => console.log(`  - ${r.test}`));
        }
        
        console.log('\n' + '='.repeat(60));
        
        if (percentage === 100) {
            console.log('\n🎉 All integration tests passed!');
        } else if (percentage >= 80) {
            console.log('\n⚠️  Most tests passed, but some issues detected.');
        } else {
            console.log('\n❌ Critical integration issues detected!');
        }
        
        return {
            passed,
            failed,
            total,
            percentage,
            results: this.results
        };
    }
};

// Export for console usage
function runIntegrationTests() {
    return IntegrationTests.runAll();
}

// Auto-run if in test mode
if (window.location.search.includes('test=true')) {
    setTimeout(() => runIntegrationTests(), 1000);
}

console.log('✅ Integration test suite loaded!');
console.log('Run tests with: runIntegrationTests()');
