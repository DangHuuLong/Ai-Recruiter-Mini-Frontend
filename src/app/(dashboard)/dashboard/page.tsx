const kpis = [
  { label: 'Total Applicants', value: '1,284', trend: '+18%', note: 'vs last month' },
  { label: 'Active Jobs', value: '36', trend: '+7', note: 'live postings' },
  { label: 'Interviews This Week', value: '48', trend: '+12%', note: 'scheduled' },
  { label: 'Offer Acceptance', value: '82%', trend: '+5%', note: 'rolling 30 days' },
];

const jobs = [
  { role: 'Senior Product Designer', department: 'Design Systems', deadline: 'Jun 12', applicants: 84, status: 'Active' },
  { role: 'AI Backend Engineer', department: 'Platform Intelligence', deadline: 'Jun 18', applicants: 126, status: 'Active' },
  { role: 'Talent Operations Lead', department: 'People Ops', deadline: 'Jun 24', applicants: 39, status: 'Reviewing' },
  { role: 'Frontend Engineer', department: 'Recruiter Experience', deadline: 'Jul 02', applicants: 73, status: 'Active' },
];

const pipeline = [
  { title: 'Applied', candidates: ['Maya Chen', 'Daniel Ho', 'An Nguyen'] },
  { title: 'Screening', candidates: ['Linh Tran', 'Aria Patel'] },
  { title: 'Interview', candidates: ['Marcus Lee', 'Nora Kim'] },
  { title: 'Offer', candidates: ['Ethan Brooks'] },
  { title: 'Hired', candidates: ['Sofia Rivera'] },
];

const candidateMeta = ['AI match 94%', 'Portfolio strong', 'Remote ready', 'Culture add'];

export default function Page() {
  return (
    <div className="space-y-8 pb-10">
      <section className="rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Overview</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">
              Hiring at a glance
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-variant">
              Track your pipeline, active postings and AI-scored candidates in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-xl border border-outline bg-surface-variant p-3">
            {kpis.map((item) => (
              <article
                key={item.label}
                className="rounded-lg border border-outline bg-surface-lowest p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                  {item.label}
                </p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className="text-3xl font-bold tracking-tight text-on-surface">
                    {item.value}
                  </span>
                  <span className="rounded-full bg-success-container px-2.5 py-1 text-xs font-bold text-success">
                    {item.trend}
                  </span>
                </div>
                <p className="mt-2 text-xs text-on-surface-muted">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Live Jobs</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-on-surface">
                Priority postings
              </h3>
            </div>
            <button className="rounded-lg border border-outline bg-surface-lowest px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-variant">
              New job
            </button>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <article
                key={job.role}
                className="rounded-xl border border-outline bg-surface-lowest p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold tracking-tight text-on-surface">{job.role}</h4>
                    <p className="mt-1 text-sm text-on-surface-variant">{job.department}</p>
                  </div>
                  <span
                    className={
                      job.status === 'Active'
                        ? 'rounded-full bg-success-container px-3 py-1 text-xs font-bold uppercase tracking-wide text-success'
                        : 'rounded-full bg-surface-variant px-3 py-1 text-xs font-bold uppercase tracking-wide text-on-surface-muted'
                    }
                  >
                    {job.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-outline bg-surface-variant p-3">
                    <p className="text-on-surface-muted">Deadline</p>
                    <p className="mt-1 font-bold text-on-surface">{job.deadline}</p>
                  </div>
                  <div className="rounded-lg border border-outline bg-surface-variant p-3">
                    <p className="text-on-surface-muted">Applicants</p>
                    <p className="mt-1 font-bold text-on-surface">{job.applicants}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-outline bg-surface-lowest p-4 shadow-card">
          <div className="mb-4 flex items-end justify-between px-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Candidate Pipeline
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-on-surface">
                Kanban board
              </h3>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-5">
            {pipeline.map((column) => (
              <section
                key={column.title}
                className="min-h-72 rounded-xl border border-outline bg-surface-variant p-3"
              >
                <h4 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">
                  {column.title}
                </h4>

                <div className="mt-4 space-y-3">
                  {column.candidates.map((candidate, index) => (
                    <article
                      key={candidate}
                      className="rounded-lg border border-outline bg-surface-lowest p-3 shadow-card"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                          {candidate
                            .split(' ')
                            .map((part) => part[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{candidate}</p>
                          <p className="text-xs text-on-surface-muted">
                            {candidateMeta[(index + column.title.length) % candidateMeta.length]}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
