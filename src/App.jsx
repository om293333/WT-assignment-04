import { useState } from 'react'
import './App.css'

const initialSubjects = [
  { code: 'CSE 2001', name: 'Data Structures', mse: '', ese: '' },
  { code: 'CSE 2002', name: 'Object Oriented Programming', mse: '', ese: '' },
  { code: 'MAT 2003', name: 'Discrete Mathematics', mse: '', ese: '' },
  { code: 'PHY 2004', name: 'Engineering Physics', mse: '', ese: '' },
]
const sampleSubjects = [
  { code: 'CSE 2001', name: 'Data Structures', mse: '26', ese: '63' },
  { code: 'CSE 2002', name: 'Object Oriented Programming', mse: '24', ese: '58' },
  { code: 'MAT 2003', name: 'Discrete Mathematics', mse: '27', ese: '66' },
  { code: 'PHY 2004', name: 'Engineering Physics', mse: '21', ese: '54' },
]
function getGrade(mark) {
  if (mark >= 90) return 'S'
  if (mark >= 80) return 'A'
  if (mark >= 70) return 'B'
  if (mark >= 60) return 'C'
  if (mark >= 50) return 'D'
  if (mark >= 40) return 'E'
  return 'F'
}

function App() {
  const [student, setStudent] = useState({ name: '', regNo: '', program: 'B.Tech Computer Science' })
  const [subjects, setSubjects] = useState(initialSubjects)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const updateStudent = (event) => setStudent((current) => ({ ...current, [event.target.name]: event.target.value }))
  const updateSubject = (index, field, value) => {
    setSubjects((current) => current.map((subject, subjectIndex) => subjectIndex === index ? { ...subject, [field]: value } : subject))
    setErrors((current) => ({ ...current, [`${field}-${index}`]: '' }))
  }
  const validate = () => {
    const nextErrors = {}
    if (!student.name.trim()) nextErrors.name = 'Enter the student name.'
    if (!student.regNo.trim()) nextErrors.regNo = 'Enter the registration number.'
    subjects.forEach((subject, index) => ['mse', 'ese'].forEach((field) => {
      const value = Number(subject[field]); const limit = field === 'mse' ? 30 : 70
      if (subject[field] === '' || Number.isNaN(value) || value < 0 || value > limit) nextErrors[`${field}-${index}`] = `Use a mark from 0 to ${limit}.`
    }))
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }
  const calculateResult = (event) => { event.preventDefault(); setSubmitted(validate()) }
  const loadSample = () => { setStudent({ name: 'Aarav Menon', regNo: '22BCE1047', program: 'B.Tech Computer Science' }); setSubjects(sampleSubjects); setErrors({}); setSubmitted(false) }
  const reset = () => { setStudent({ name: '', regNo: '', program: 'B.Tech Computer Science' }); setSubjects(initialSubjects); setErrors({}); setSubmitted(false) }
  const results = subjects.map((subject) => ({ ...subject, total: Number(subject.mse || 0) + Number(subject.ese || 0) }))
  const totalMarks = results.reduce((sum, subject) => sum + subject.total, 0)
  const percentage = totalMarks / 4
  const passed = results.every((subject) => subject.total >= 40)

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark">V</span><span>VIT<span className="brand-accent">.</span>RESULTS</span></div><div className="student-identity"><strong>Vaibhav Murde</strong><span>Roll No. 31</span></div><div className="semester-tag">SEMESTER 04 <span>2024-25</span></div></header>
      <div className="content-wrap">
        <section className="intro"><div><p className="eyebrow">Academic performance desk</p><h1>Build your <em>semester</em> result.</h1><p className="intro-copy">Enter internal and end-semester marks to get a clean, instant scorecard.</p></div><div className="intro-note"><span>01</span><p>Four subjects<br />One clear result</p></div></section>
        <form onSubmit={calculateResult} noValidate>
          <section className="panel"><div className="panel-heading"><span className="step">01</span><div><h2>Student details</h2><p>Tell us who this scorecard belongs to.</p></div></div><div className="student-fields"><label>Full name<input name="name" value={student.name} onChange={updateStudent} placeholder="e.g. Aarav Menon" aria-invalid={Boolean(errors.name)} />{errors.name && <small>{errors.name}</small>}</label><label>Registration number<input name="regNo" value={student.regNo} onChange={updateStudent} placeholder="e.g. 22BCE1047" aria-invalid={Boolean(errors.regNo)} />{errors.regNo && <small>{errors.regNo}</small>}</label><label>Programme<select name="program" value={student.program} onChange={updateStudent}><option>B.Tech Computer Science</option><option>B.Tech Information Technology</option><option>B.Tech Electronics</option></select></label></div></section>
          <section className="panel"><div className="panel-heading"><span className="step">02</span><div><h2>Enter marks</h2><p>MSE carries 30% and ESE carries 70% of each subject.</p></div><button className="sample-button" type="button" onClick={loadSample}>Load sample</button></div><div className="marks-table" role="table" aria-label="Subject marks"><div className="table-header"><span>Subject</span><span>MSE <b>/ 30</b></span><span>ESE <b>/ 70</b></span><span>Total <b>/ 100</b></span></div>{subjects.map((subject, index) => <div className="subject-row" key={subject.code}><div className="subject-name"><strong>{subject.code}</strong><span>{subject.name}</span></div><label className="mark-input"><span className="mobile-label">MSE</span><input type="number" min="0" max="30" value={subject.mse} onChange={(event) => updateSubject(index, 'mse', event.target.value)} placeholder="--" aria-label={`${subject.name} MSE mark`} aria-invalid={Boolean(errors[`mse-${index}`])} /><small>/ 30</small>{errors[`mse-${index}`] && <em>{errors[`mse-${index}`]}</em>}</label><label className="mark-input"><span className="mobile-label">ESE</span><input type="number" min="0" max="70" value={subject.ese} onChange={(event) => updateSubject(index, 'ese', event.target.value)} placeholder="--" aria-label={`${subject.name} ESE mark`} aria-invalid={Boolean(errors[`ese-${index}`])} /><small>/ 70</small>{errors[`ese-${index}`] && <em>{errors[`ese-${index}`]}</em>}</label><strong className="subject-total">{subject.mse !== '' && subject.ese !== '' ? Number(subject.mse) + Number(subject.ese) : '--'}</strong></div>)}</div></section>
          <div className="actions"><button type="button" className="reset-button" onClick={reset}>Clear all</button><button type="submit" className="calculate-button">Calculate result <span>-&gt;</span></button></div>
        </form>
        {submitted && <section className="result-panel"><div className="result-top"><div><p className="eyebrow">Official scorecard</p><h2>{student.name}</h2><p>{student.regNo} <span className="dot">&middot;</span> {student.program}</p></div><div className={passed ? 'status pass' : 'status fail'}><span className="status-dot" />{passed ? 'PASS' : 'REVIEW'}</div></div><div className="result-stats"><div><span>Total marks</span><strong>{totalMarks}<small> / 400</small></strong></div><div><span>Percentage</span><strong>{percentage.toFixed(2)}<small>%</small></strong></div><div><span>Overall grade</span><strong>{getGrade(percentage)}</strong></div></div><div>{results.map((subject) => <div className="breakdown-row" key={subject.code}><span>{subject.code} <b>{subject.name}</b></span><strong>{subject.total}<small> / 100</small></strong><span className="grade-pill">{getGrade(subject.total)}</span></div>)}</div></section>}
      </div><footer><span>VIT ACADEMIC SERVICES</span><span>Marks are calculated on a 100-point scale</span></footer>
    </main>
  )
}

export default App
