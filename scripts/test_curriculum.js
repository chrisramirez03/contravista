var cStr = $.NSString.stringWithContentsOfFileEncodingError('curriculum.js', $.NSUTF8StringEncoding, null).js;
eval(cStr);

var course = COURSES_CATALOG[0];
console.log('✅ Master Curriculum successfully parsed!');
console.log('Title: ' + course.title);
console.log('Total Phases: ' + course.phases.length);
var lessonCount = 0;
var stepCount = 0;
course.phases.forEach(function(phase) {
    lessonCount += phase.lessons.length;
    phase.lessons.forEach(function(l) {
        stepCount += l.steps.length;
    });
});
console.log('Total Lessons: ' + lessonCount);
console.log('Total Interactive Steps: ' + stepCount);
