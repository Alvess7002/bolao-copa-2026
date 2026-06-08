import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Limpa dados existentes
  await prisma.prediction.deleteMany()
  await prisma.bonusPrediction.deleteMany()
  await prisma.rankingEntry.deleteMany()
  await prisma.match.deleteMany()
  await prisma.team.deleteMany()
  await prisma.group.deleteMany()
  await prisma.bolaoConfig.deleteMany()

  // Cria configuração do bolão
  await prisma.bolaoConfig.create({
    data: {
      id: 'default',
      name: 'Bolão Copa 2026',
      groupCorrectPts: 3,
      knockoutCorrectPts: 5,
      championPts: 20,
      runnerUpPts: 10,
      thirdPlacePts: 5,
      topScorerPts: 10,
      bestPlayerPts: 10,
    }
  })

  // Cria os 12 grupos
  const groups = await Promise.all(
    ['A','B','C','D','E','F','G','H','I','J','K','L'].map(code =>
      prisma.group.create({ data: { code, name: `Grupo ${code}` } })
    )
  )

  const getGroup = (code: string) => groups.find(g => g.code === code)!

  // Cria as 48 seleções
  const teamsData = [
    // Grupo A
    { name: 'México',        code: 'MEX', flagEmoji: '🇲🇽', groupCode: 'A' },
    { name: 'África do Sul', code: 'RSA', flagEmoji: '🇿🇦', groupCode: 'A' },
    { name: 'Coreia do Sul', code: 'KOR', flagEmoji: '🇰🇷', groupCode: 'A' },
    { name: 'Rep. Tcheca',   code: 'CZE', flagEmoji: '🇨🇿', groupCode: 'A' },
    // Grupo B
    { name: 'Canadá',        code: 'CAN', flagEmoji: '🇨🇦', groupCode: 'B' },
    { name: 'Bósnia e Herz.',code: 'BIH', flagEmoji: '🇧🇦', groupCode: 'B' },
    { name: 'Catar',         code: 'QAT', flagEmoji: '🇶🇦', groupCode: 'B' },
    { name: 'Suíça',         code: 'SUI', flagEmoji: '🇨🇭', groupCode: 'B' },
    // Grupo C
    { name: 'Brasil',        code: 'BRA', flagEmoji: '🇧🇷', groupCode: 'C' },
    { name: 'Marrocos',      code: 'MAR', flagEmoji: '🇲🇦', groupCode: 'C' },
    { name: 'Haiti',         code: 'HAI', flagEmoji: '🇭🇹', groupCode: 'C' },
    { name: 'Escócia',       code: 'SCO', flagEmoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', groupCode: 'C' },
    // Grupo D
    { name: 'Estados Unidos',code: 'USA', flagEmoji: '🇺🇸', groupCode: 'D' },
    { name: 'Paraguai',      code: 'PAR', flagEmoji: '🇵🇾', groupCode: 'D' },
    { name: 'Austrália',     code: 'AUS', flagEmoji: '🇦🇺', groupCode: 'D' },
    { name: 'Turquia',       code: 'TUR', flagEmoji: '🇹🇷', groupCode: 'D' },
    // Grupo E
    { name: 'Alemanha',      code: 'GER', flagEmoji: '🇩🇪', groupCode: 'E' },
    { name: 'Curaçao',       code: 'CUW', flagEmoji: '🇨🇼', groupCode: 'E' },
    { name: 'Costa do Marfim',code:'CIV', flagEmoji: '🇨🇮', groupCode: 'E' },
    { name: 'Equador',       code: 'ECU', flagEmoji: '🇪🇨', groupCode: 'E' },
    // Grupo F
    { name: 'Holanda',       code: 'NED', flagEmoji: '🇳🇱', groupCode: 'F' },
    { name: 'Japão',         code: 'JPN', flagEmoji: '🇯🇵', groupCode: 'F' },
    { name: 'Suécia',        code: 'SWE', flagEmoji: '🇸🇪', groupCode: 'F' },
    { name: 'Tunísia',       code: 'TUN', flagEmoji: '🇹🇳', groupCode: 'F' },
    // Grupo G
    { name: 'Bélgica',       code: 'BEL', flagEmoji: '🇧🇪', groupCode: 'G' },
    { name: 'Egito',         code: 'EGY', flagEmoji: '🇪🇬', groupCode: 'G' },
    { name: 'Irã',           code: 'IRN', flagEmoji: '🇮🇷', groupCode: 'G' },
    { name: 'Nova Zelândia', code: 'NZL', flagEmoji: '🇳🇿', groupCode: 'G' },
    // Grupo H
    { name: 'Espanha',       code: 'ESP', flagEmoji: '🇪🇸', groupCode: 'H' },
    { name: 'Cabo Verde',    code: 'CPV', flagEmoji: '🇨🇻', groupCode: 'H' },
    { name: 'Arábia Saudita',code: 'KSA', flagEmoji: '🇸🇦', groupCode: 'H' },
    { name: 'Uruguai',       code: 'URU', flagEmoji: '🇺🇾', groupCode: 'H' },
    // Grupo I
    { name: 'França',        code: 'FRA', flagEmoji: '🇫🇷', groupCode: 'I' },
    { name: 'Senegal',       code: 'SEN', flagEmoji: '🇸🇳', groupCode: 'I' },
    { name: 'Iraque',        code: 'IRQ', flagEmoji: '🇮🇶', groupCode: 'I' },
    { name: 'Noruega',       code: 'NOR', flagEmoji: '🇳🇴', groupCode: 'I' },
    // Grupo J
    { name: 'Argentina',     code: 'ARG', flagEmoji: '🇦🇷', groupCode: 'J' },
    { name: 'Argélia',       code: 'ALG', flagEmoji: '🇩🇿', groupCode: 'J' },
    { name: 'Áustria',       code: 'AUT', flagEmoji: '🇦🇹', groupCode: 'J' },
    { name: 'Jordânia',      code: 'JOR', flagEmoji: '🇯🇴', groupCode: 'J' },
    // Grupo K
    { name: 'Portugal',      code: 'POR', flagEmoji: '🇵🇹', groupCode: 'K' },
    { name: 'Uzbequistão',   code: 'UZB', flagEmoji: '🇺🇿', groupCode: 'K' },
    { name: 'Colômbia',      code: 'COL', flagEmoji: '🇨🇴', groupCode: 'K' },
    { name: 'RD Congo',      code: 'COD', flagEmoji: '🇨🇩', groupCode: 'K' },
    // Grupo L
    { name: 'Inglaterra',    code: 'ENG', flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', groupCode: 'L' },
    { name: 'Croácia',       code: 'CRO', flagEmoji: '🇭🇷', groupCode: 'L' },
    { name: 'Gana',          code: 'GHA', flagEmoji: '🇬🇭', groupCode: 'L' },
    { name: 'Panamá',        code: 'PAN', flagEmoji: '🇵🇦', groupCode: 'L' },
  ]

  const teams = await Promise.all(
    teamsData.map(t =>
      prisma.team.create({
        data: {
          name: t.name,
          code: t.code,
          flagEmoji: t.flagEmoji,
          groupId: getGroup(t.groupCode).id,
        }
      })
    )
  )

  const getTeam = (code: string) => teams.find(t => t.code === code)!

  // Cria os 72 jogos da fase de grupos
  const matchesData = [
    // GRUPO A
    { g:'A', h:'MEX', a:'RSA', dt: new Date('2026-06-11T19:00:00Z'), city:'Cidade do México' },
    { g:'A', h:'KOR', a:'CZE', dt: new Date('2026-06-12T02:00:00Z'), city:'Guadalajara' },
    { g:'A', h:'MEX', a:'KOR', dt: new Date('2026-06-18T01:00:00Z'), city:'Guadalajara' },
    { g:'A', h:'CZE', a:'RSA', dt: new Date('2026-06-18T16:00:00Z'), city:'Atlanta' },
    { g:'A', h:'CZE', a:'MEX', dt: new Date('2026-06-24T01:00:00Z'), city:'Cidade do México' },
    { g:'A', h:'RSA', a:'KOR', dt: new Date('2026-06-24T01:00:00Z'), city:'Monterrey' },
    // GRUPO B
    { g:'B', h:'CAN', a:'BIH', dt: new Date('2026-06-12T19:00:00Z'), city:'Toronto' },
    { g:'B', h:'QAT', a:'SUI', dt: new Date('2026-06-13T19:00:00Z'), city:'San Francisco' },
    { g:'B', h:'SUI', a:'BIH', dt: new Date('2026-06-18T19:00:00Z'), city:'Los Angeles' },
    { g:'B', h:'CAN', a:'QAT', dt: new Date('2026-06-19T19:00:00Z'), city:'Vancouver' },
    { g:'B', h:'SUI', a:'CAN', dt: new Date('2026-06-24T19:00:00Z'), city:'Vancouver' },
    { g:'B', h:'BIH', a:'QAT', dt: new Date('2026-06-24T19:00:00Z'), city:'Seattle' },
    // GRUPO C
    { g:'C', h:'BRA', a:'MAR', dt: new Date('2026-06-13T22:00:00Z'), city:'Nova York/NJ' },
    { g:'C', h:'HAI', a:'SCO', dt: new Date('2026-06-14T01:00:00Z'), city:'Boston' },
    { g:'C', h:'BRA', a:'HAI', dt: new Date('2026-06-19T01:00:00Z'), city:'Filadélfia' },
    { g:'C', h:'SCO', a:'MAR', dt: new Date('2026-06-19T22:00:00Z'), city:'Boston' },
    { g:'C', h:'SCO', a:'BRA', dt: new Date('2026-06-24T22:00:00Z'), city:'Miami' },
    { g:'C', h:'MAR', a:'HAI', dt: new Date('2026-06-24T22:00:00Z'), city:'Atlanta' },
    // GRUPO D
    { g:'D', h:'USA', a:'PAR', dt: new Date('2026-06-13T01:00:00Z'), city:'Los Angeles' },
    { g:'D', h:'AUS', a:'TUR', dt: new Date('2026-06-14T04:00:00Z'), city:'Vancouver' },
    { g:'D', h:'TUR', a:'PAR', dt: new Date('2026-06-19T04:00:00Z'), city:'San Francisco' },
    { g:'D', h:'USA', a:'AUS', dt: new Date('2026-06-19T19:00:00Z'), city:'Seattle' },
    { g:'D', h:'TUR', a:'USA', dt: new Date('2026-06-25T02:00:00Z'), city:'Los Angeles' },
    { g:'D', h:'PAR', a:'AUS', dt: new Date('2026-06-25T02:00:00Z'), city:'San Francisco' },
    // GRUPO E
    { g:'E', h:'GER', a:'CUW', dt: new Date('2026-06-14T17:00:00Z'), city:'Houston' },
    { g:'E', h:'CIV', a:'ECU', dt: new Date('2026-06-14T23:00:00Z'), city:'Filadélfia' },
    { g:'E', h:'GER', a:'CIV', dt: new Date('2026-06-20T20:00:00Z'), city:'Toronto' },
    { g:'E', h:'ECU', a:'CUW', dt: new Date('2026-06-21T00:00:00Z'), city:'Kansas City' },
    { g:'E', h:'ECU', a:'GER', dt: new Date('2026-06-25T20:00:00Z'), city:'Nova York/NJ' },
    { g:'E', h:'CUW', a:'CIV', dt: new Date('2026-06-25T20:00:00Z'), city:'Filadélfia' },
    // GRUPO F
    { g:'F', h:'NED', a:'JPN', dt: new Date('2026-06-14T20:00:00Z'), city:'Dallas' },
    { g:'F', h:'SWE', a:'TUN', dt: new Date('2026-06-15T02:00:00Z'), city:'Monterrey' },
    { g:'F', h:'NED', a:'SWE', dt: new Date('2026-06-20T17:00:00Z'), city:'Houston' },
    { g:'F', h:'TUN', a:'JPN', dt: new Date('2026-06-21T04:00:00Z'), city:'Monterrey' },
    { g:'F', h:'JPN', a:'SWE', dt: new Date('2026-06-25T23:00:00Z'), city:'Dallas' },
    { g:'F', h:'TUN', a:'NED', dt: new Date('2026-06-25T23:00:00Z'), city:'Kansas City' },
    // GRUPO G
    { g:'G', h:'BEL', a:'EGY', dt: new Date('2026-06-15T19:00:00Z'), city:'Seattle' },
    { g:'G', h:'IRN', a:'NZL', dt: new Date('2026-06-16T01:00:00Z'), city:'Los Angeles' },
    { g:'G', h:'BEL', a:'IRN', dt: new Date('2026-06-21T19:00:00Z'), city:'Los Angeles' },
    { g:'G', h:'NZL', a:'EGY', dt: new Date('2026-06-22T01:00:00Z'), city:'Vancouver' },
    { g:'G', h:'EGY', a:'IRN', dt: new Date('2026-06-27T03:00:00Z'), city:'Seattle' },
    { g:'G', h:'NZL', a:'BEL', dt: new Date('2026-06-27T03:00:00Z'), city:'Vancouver' },
    // GRUPO H
    { g:'H', h:'ESP', a:'CPV', dt: new Date('2026-06-15T16:00:00Z'), city:'Atlanta' },
    { g:'H', h:'KSA', a:'URU', dt: new Date('2026-06-15T22:00:00Z'), city:'Miami' },
    { g:'H', h:'ESP', a:'KSA', dt: new Date('2026-06-21T16:00:00Z'), city:'Atlanta' },
    { g:'H', h:'URU', a:'CPV', dt: new Date('2026-06-21T22:00:00Z'), city:'Miami' },
    { g:'H', h:'URU', a:'ESP', dt: new Date('2026-06-27T00:00:00Z'), city:'Guadalajara' },
    { g:'H', h:'CPV', a:'KSA', dt: new Date('2026-06-27T00:00:00Z'), city:'Houston' },
    // GRUPO I
    { g:'I', h:'FRA', a:'SEN', dt: new Date('2026-06-16T19:00:00Z'), city:'Nova York/NJ' },
    { g:'I', h:'IRQ', a:'NOR', dt: new Date('2026-06-16T22:00:00Z'), city:'Boston' },
    { g:'I', h:'FRA', a:'IRQ', dt: new Date('2026-06-22T21:00:00Z'), city:'Filadélfia' },
    { g:'I', h:'NOR', a:'SEN', dt: new Date('2026-06-23T00:00:00Z'), city:'Nova York/NJ' },
    { g:'I', h:'NOR', a:'FRA', dt: new Date('2026-06-26T19:00:00Z'), city:'Boston' },
    { g:'I', h:'SEN', a:'IRQ', dt: new Date('2026-06-26T19:00:00Z'), city:'Toronto' },
    // GRUPO J
    { g:'J', h:'ARG', a:'ALG', dt: new Date('2026-06-16T17:00:00Z'), city:'Kansas City' },
    { g:'J', h:'AUT', a:'JOR', dt: new Date('2026-06-17T04:00:00Z'), city:'San Francisco' },
    { g:'J', h:'ARG', a:'AUT', dt: new Date('2026-06-22T17:00:00Z'), city:'Dallas' },
    { g:'J', h:'JOR', a:'ALG', dt: new Date('2026-06-23T03:00:00Z'), city:'San Francisco' },
    { g:'J', h:'JOR', a:'ARG', dt: new Date('2026-06-28T02:00:00Z'), city:'Dallas' },
    { g:'J', h:'ALG', a:'AUT', dt: new Date('2026-06-28T02:00:00Z'), city:'Kansas City' },
    // GRUPO K
    { g:'K', h:'POR', a:'COD', dt: new Date('2026-06-17T17:00:00Z'), city:'Houston' },
    { g:'K', h:'UZB', a:'COL', dt: new Date('2026-06-18T02:00:00Z'), city:'Cidade do México' },
    { g:'K', h:'POR', a:'UZB', dt: new Date('2026-06-23T17:00:00Z'), city:'Houston' },
    { g:'K', h:'COL', a:'COD', dt: new Date('2026-06-24T02:00:00Z'), city:'Guadalajara' },
    { g:'K', h:'COL', a:'POR', dt: new Date('2026-06-27T23:30:00Z'), city:'Miami' },
    { g:'K', h:'COD', a:'UZB', dt: new Date('2026-06-27T23:30:00Z'), city:'Atlanta' },
    // GRUPO L
    { g:'L', h:'ENG', a:'CRO', dt: new Date('2026-06-17T20:00:00Z'), city:'Dallas' },
    { g:'L', h:'GHA', a:'PAN', dt: new Date('2026-06-17T23:00:00Z'), city:'Toronto' },
    { g:'L', h:'ENG', a:'GHA', dt: new Date('2026-06-23T20:00:00Z'), city:'Boston' },
    { g:'L', h:'PAN', a:'CRO', dt: new Date('2026-06-23T23:00:00Z'), city:'Toronto' },
    { g:'L', h:'PAN', a:'ENG', dt: new Date('2026-06-27T21:00:00Z'), city:'Nova York/NJ' },
    { g:'L', h:'CRO', a:'GHA', dt: new Date('2026-06-27T21:00:00Z'), city:'Filadélfia' },
  ]

  await Promise.all(
    matchesData.map(m =>
      prisma.match.create({
        data: {
          phase: 'GROUPS',
          groupId: getGroup(m.g).id,
          homeTeamId: getTeam(m.h).id,
          awayTeamId: getTeam(m.a).id,
          matchDate: m.dt,
          city: m.city,
          status: 'SCHEDULED',
        }
      })
    )
  )

  console.log('✅ Seed concluído!')
  console.log(`   ✓ 1 configuração`)
  console.log(`   ✓ 12 grupos`)
  console.log(`   ✓ 48 seleções`)
  console.log(`   ✓ 72 partidas`)
}

main()
  .catch(e => { console.error('❌ Erro:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())