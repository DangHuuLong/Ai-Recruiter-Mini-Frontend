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
  {
    title: 'Applied',
    accent: 'from-violet-400 to-fuchsia-400',
    candidates: ['Maya Chen', 'Daniel Ho', 'An Nguyen'],
  },
  {
    title: 'Screening',
    accent: 'from-cyan-300 to-emerald-300',
    candidates: ['Linh Tran', 'Aria Patel'],
  },
  {
    title: 'Interview',
    accent: 'from-amber-200 to-orange-300',
    candidates: ['Marcus Lee', 'Nora Kim'],
  },
  {
    title: 'Offer',
    accent: 'from-pink-300 to-violet-300',
    candidates: ['Ethan Brooks'],
  },
  {
    title: 'Hired',
    accent: 'from-emerald-300 to-lime-300',
    candidates: ['Sofia Rivera'],
  },
];

const candidateMeta = ['AI match 94%', 'Portfolio strong', 'Remote ready', 'Culture add'];

export default function Page() {
  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.055] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-px w-1/2 bg-gradient-to-r from-transparent via-[var(--color-accent)]/70 to-transparent" />

        <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.42em] text-[var(--color-accent)]">
              Soft Futurism RMS
            </p>
            <h2 className="mt-5 max-w-4xl font-display text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl">
              Hire like a mission control team.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
              A non-corporate recruitment workspace with aurora surfaces, sharp signal cards, live pipeline movement and AI-first hiring context.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-[2rem] border border-white/10 bg-[#0b0716]/70 p-3">
            {kpis.map((item, index) => (
              <article
                key={item.label}
                className="group rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 transition duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/40 hover:bg-white/[0.1] hover:shadow-[0_0_40px_rgba(87,242,204,0.12)]"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
                  {item.label}
                </p>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <span className="font-display text-4xl font-black tracking-[-0.08em] text-white">
                    {item.value}
                  </span>
                  <span className="rounded-full bg-[var(--color-accent)]/12 px-2.5 py-1 text-xs font-bold text-[var(--color-accent)]">
                    {item.trend}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-[var(--color-accent)]">
                Live Jobs
              </p>
              <h3 className="mt-2 font-display text-3xl font-black tracking-[-0.05em] text-white">
                Priority postings
              </h3>
            </div>
            <button className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/10">
              New job
            </button>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <article
                key={job.role}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/35 hover:bg-white/[0.1]"
              >
                <div className="absolute -right-16 -top-16 size-32 rounded-full bg-[var(--color-primary)]/20 blur-2xl opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-display text-xl font-bold tracking-[-0.03em] text-white">
                      {job.role}
                    </h4>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{job.department}</p>
                  </div>
                  <span className={job.status === 'Active' ? 'rounded-full bg-[var(--color-accent)]/14 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-accent)] shadow-[0_0_24px_rgba(87,242,204,0.18)] animate-pulse' : 'rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-text-secondary)]'}>
                    {job.status}
                  </span>
                </div>

                <div className="relative mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-[#0b0716]/50 p-3">
                    <p className="text-[var(--color-text-tertiary)]">Deadline</p>
                    <p className="mt-1 font-bold text-white">{job.deadline}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0b0716]/50 p-3">
                    <p className="text-[var(--color-text-tertiary)]">Applicants</p>
                    <p className="mt-1 font-bold text-white">{job.applicants}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-[0_28px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
          <div className="mb-4 flex items-end justify-between px-2">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.32em] text-[var(--color-accent)]">
                Candidate Pipeline
              </p>
              <h3 className="mt-2 font-display text-3xl font-black tracking-[-0.05em] text-white">
                Kanban signal board
              </h3>
            </div>
            <p className="hidden max-w-xs text-right text-sm text-[var(--color-text-tertiary)] md:block">
              Drag-over inspired glow states and compact candidate cards for dense recruiter scanning.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-5">
            {pipeline.map((column) => (
              <section
                key={column.title}
                className="group min-h-72 rounded-[1.5rem] border border-white/10 bg-[#0b0716]/58 p-3 transition duration-300 hover:border-[var(--color-accent)]/35 hover:bg-[var(--color-accent)]/8 hover:shadow-[inset_0_0_0_1px_rgba(87,242,204,0.12),0_0_36px_rgba(87,242,204,0.08)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display text-sm font-black uppercase tracking-[0.18em] text-white">
                    {column.title}
                  </h4>
                  <span className={`h-2 w-12 rounded-full bg-gradient-to-r ${column.accent}`} />
                </div>

                <div className="mt-4 space-y-3">
                  {column.candidates.map((candidate, index) => (
                    <article
                      key={candidate}
                      className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.11]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] font-display text-xs font-black text-[#0b0715]">
                          {candidate
                            .split(' ')
                            .map((part) => part[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{candidate}</p>
                          <p className="text-xs text-[var(--color-text-tertiary)]">
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
