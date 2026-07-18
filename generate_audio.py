#!/usr/bin/env python3
"""Deterministický generátor retro fantasy WAV assetů pro Milník 10."""
from __future__ import annotations
import math, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "audio"
SR = 22050
RNG = np.random.default_rng(417)

NOTE = {name: 440.0 * 2 ** ((midi - 69) / 12) for name, midi in {
    'C2':36,'Cs2':37,'D2':38,'Ds2':39,'E2':40,'F2':41,'Fs2':42,'G2':43,'Gs2':44,'A2':45,'As2':46,'B2':47,
    'C3':48,'Cs3':49,'D3':50,'Ds3':51,'E3':52,'F3':53,'Fs3':54,'G3':55,'Gs3':56,'A3':57,'As3':58,'B3':59,
    'C4':60,'Cs4':61,'D4':62,'Ds4':63,'E4':64,'F4':65,'Fs4':66,'G4':67,'Gs4':68,'A4':69,'As4':70,'B4':71,
    'C5':72,'Cs5':73,'D5':74,'Ds5':75,'E5':76,'F5':77,'Fs5':78,'G5':79,'Gs5':80,'A5':81,'As5':82,'B5':83,
    'C6':84,'Cs6':85,'D6':86,'Ds6':87,'E6':88,'F6':89,'Fs6':90,'G6':91,'Gs6':92,'A6':93,'As6':94,'B6':95,
}.items()}

def osc(freq, n, kind='sine', phase=0.0):
    t = np.arange(n, dtype=np.float64) / SR
    p = 2*np.pi*freq*t + phase
    if kind == 'sine': return np.sin(p)
    if kind == 'triangle': return 2/np.pi*np.arcsin(np.sin(p))
    if kind == 'square': return np.sign(np.sin(p))
    if kind == 'saw': return 2*((freq*t + phase/(2*np.pi)) % 1)-1
    return np.sin(p)

def env(n, attack=.01, decay=.08, sustain=.65, release=.12):
    a,d,r = int(attack*SR), int(decay*SR), int(release*SR)
    a=min(a,n); d=min(d,max(0,n-a)); r=min(r,max(0,n-a-d)); s=max(0,n-a-d-r)
    parts=[]
    if a: parts.append(np.linspace(0,1,a,endpoint=False))
    if d: parts.append(np.linspace(1,sustain,d,endpoint=False))
    if s: parts.append(np.full(s,sustain))
    if r: parts.append(np.linspace(sustain,0,r,endpoint=True))
    out=np.concatenate(parts) if parts else np.zeros(n)
    return np.pad(out,(0,max(0,n-len(out))))[:n]

def lowpass(x, cutoff=0.12):
    # jednoduchý jednopólový filtr; cutoff 0..1
    a=max(.001,min(.99,cutoff))
    y=np.empty_like(x); y[0]=x[0]
    for i in range(1,len(x)): y[i]=y[i-1]+a*(x[i]-y[i-1])
    return y

def highpass(x, cutoff=.04): return x-lowpass(x,cutoff)

def pan(mono, position=0.0):
    position=max(-1,min(1,position)); angle=(position+1)*math.pi/4
    return np.stack((mono*math.cos(angle), mono*math.sin(angle)),axis=1)

def add(buf, signal, start=0, gain=1.0, position=0.0):
    if signal.ndim==1: signal=pan(signal,position)
    end=min(len(buf),start+len(signal))
    if end>start: buf[start:end]+=signal[:end-start]*gain

def note(freq, duration, kind='triangle', volume=.3, attack=.01, decay=.08, sustain=.55, release=.12, vibrato=0.0):
    n=max(1,int(duration*SR)); t=np.arange(n)/SR
    if vibrato:
        phase=2*np.pi*np.cumsum(freq*(1+vibrato*np.sin(2*np.pi*5.2*t)))/SR
        wave_=np.sin(phase) if kind=='sine' else 2/np.pi*np.arcsin(np.sin(phase))
    else: wave_=osc(freq,n,kind)
    return wave_*env(n,attack,decay,sustain,release)*volume

def pluck(freq,duration=.35,volume=.28):
    n=int(duration*SR); x=(.65*osc(freq,n,'triangle')+.23*osc(freq*2,n,'sine')+.12*osc(freq*3,n,'sine'))
    return x*np.exp(-np.arange(n)/(SR*.12))*volume

def bell(freq,duration=1.3,volume=.25):
    n=int(duration*SR); t=np.arange(n)/SR
    x=np.zeros(n)
    for mul,amp,dec in [(1,.7,1.6),(2.01,.22,.8),(3.96,.12,.45),(6.1,.06,.25)]:
        x += osc(freq*mul,n,'sine')*amp*np.exp(-t/dec)
    return x*volume

def drum(kind='kick',duration=.25,volume=.5):
    n=int(duration*SR); t=np.arange(n)/SR; noise=RNG.normal(0,1,n)
    if kind=='kick':
        phase=2*np.pi*np.cumsum(95*np.exp(-t*16)+38)/SR
        return np.sin(phase)*np.exp(-t*18)*volume
    if kind=='snare': return (highpass(noise,.08)*.65+osc(180,n,'triangle')*.2)*np.exp(-t*14)*volume
    if kind=='hat': return highpass(noise,.2)*np.exp(-t*35)*volume*.5
    if kind=='tom':
        phase=2*np.pi*np.cumsum(150*np.exp(-t*8)+65)/SR
        return np.sin(phase)*np.exp(-t*10)*volume
    return noise*np.exp(-t*12)*volume

def delay(stereo, seconds=.24, feedback=.24):
    d=int(seconds*SR); out=stereo.copy()
    for k in range(1,4):
        if d*k>=len(out): break
        out[d*k:,0]+=stereo[:-d*k,1]*(feedback**k)
        out[d*k:,1]+=stereo[:-d*k,0]*(feedback**k)
    return out

def normalize(x, peak=.88):
    m=np.max(np.abs(x)) if len(x) else 0
    return x if m<1e-9 else x*(peak/m)

def write(path, data):
    path=OUT/path; path.parent.mkdir(parents=True,exist_ok=True)
    data=normalize(data)
    if data.ndim==1: channels=1
    else: channels=data.shape[1]
    pcm=np.clip(data,-1,1)
    pcm=(pcm*32767).astype('<i2')
    with wave.open(str(path),'wb') as w:
        w.setnchannels(channels); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

def music(name,bpm,bars,chords,melody,mode='field'):
    beat=60/bpm; duration=bars*4*beat; buf=np.zeros((int(duration*SR),2),dtype=np.float64)
    # pad + bass
    for bar in range(bars):
        chord=chords[bar%len(chords)]
        start=int(bar*4*beat*SR)
        for j,f in enumerate(chord):
            sig=note(f,4*beat,'triangle',.10,.18,.35,.55,.5)
            add(buf,sig,start,1,(-.45+j*.45))
        bass=note(chord[0]/2,3.7*beat,'square',.08,.02,.15,.35,.28)
        add(buf,lowpass(bass,.055),start,1,-.08)
    # ostinato/plucks
    for step in range(bars*8):
        chord=chords[(step//8)%len(chords)]
        f=chord[step%len(chord)]*(2 if step%4==3 else 1)
        start=int(step*(beat/2)*SR)
        add(buf,pluck(f,.36*beat+.08,.20),start,1,(-.55 if step%2==0 else .55))
    # melody
    for index,token in enumerate(melody*(math.ceil(bars*8/len(melody)))):
        if index>=bars*8: break
        start=int(index*(beat/2)*SR)
        if token:
            add(buf,note(token,.48*beat,'triangle',.20,.015,.05,.65,.10,vibrato=.004),start,1,.18)
    # percussion
    for step in range(bars*16):
        start=int(step*(beat/4)*SR)
        if mode in ('combat','boss'):
            if step%4==0: add(buf,drum('kick',.24,.5),start,1,0)
            if step%8==4: add(buf,drum('snare',.22,.38),start,1,.12)
            if step%2==1: add(buf,drum('hat',.08,.18),start,1,(-.35 if step%4==1 else .35))
            if mode=='boss' and step%16 in (6,14): add(buf,drum('tom',.25,.28),start,1,-.2)
        elif mode=='march':
            if step%8 in (0,4): add(buf,drum('tom',.25,.24),start,1,0)
            if step%4==2: add(buf,drum('hat',.07,.10),start,1,.3)
        elif mode=='field':
            if step%16 in (0,10): add(buf,drum('tom',.22,.10),start,1,-.1)
    # character accents
    if mode in ('night','crypt'):
        for bar in range(bars):
            f=chords[bar%len(chords)][-1]*2
            add(buf,bell(f,1.4,.11),int((bar*4+2.5)*beat*SR),1,.6 if bar%2 else -.6)
    buf=delay(buf,.29,.18)
    # fade loop edges minimally
    fade=int(.08*SR); buf[:fade]*=np.linspace(0,1,fade)[:,None]; buf[-fade:]*=np.linspace(1,0,fade)[:,None]
    write(Path('music')/f'{name}.wav',buf)

def ambience(name,duration,kind):
    n=int(duration*SR); t=np.arange(n)/SR; l=RNG.normal(0,1,n); r=RNG.normal(0,1,n)
    if kind=='forest':
        base=np.stack((lowpass(l,.008),lowpass(r,.008)),axis=1)*.35
        for k in range(12):
            st=int(RNG.uniform(0,duration-.8)*SR); f=RNG.uniform(1700,3600)
            chirp=note(f,.12,'sine',.10,.005,.02,.2,.04)
            overtone=note(f*1.18,.10,'sine',.06,.005,.02,.2,.04)
            chirp[:len(overtone)] += overtone
            add(base,chirp,st,1,RNG.uniform(-.9,.9))
    elif kind=='wind':
        gust=(np.sin(2*np.pi*.07*t)+np.sin(2*np.pi*.13*t+1.2))*0.25+0.55
        base=np.stack((lowpass(l,.012)*gust,lowpass(r,.012)*gust),axis=1)*.55
        base+=pan(note(82.4,duration,'sine',.035,.5,.5,.8,.5),-.2)
    else:
        base=np.stack((lowpass(l,.004),lowpass(r,.004)),axis=1)*.24
        base+=pan(note(55,duration,'sine',.06,.5,.5,.8,.5),0)
        for k in range(7):
            st=int(RNG.uniform(0,duration-2)*SR); add(base,bell(RNG.choice([130.81,146.83,174.61]),2,.06),st,1,RNG.uniform(-.7,.7))
    fade=int(.5*SR); base[:fade]*=np.linspace(0,1,fade)[:,None]; base[-fade:]*=np.linspace(1,0,fade)[:,None]
    write(Path('ambience')/f'{name}.wav',base)

def sfx(name, signal, stereo=False):
    if stereo and signal.ndim==1: signal=pan(signal,0)
    write(Path('sfx')/f'{name}.wav',signal)

def sweep(f0,f1,duration,kind='sine',volume=.45,noise=0):
    n=int(duration*SR); t=np.arange(n)/SR; freqs=np.geomspace(max(1,f0),max(1,f1),n); phase=2*np.pi*np.cumsum(freqs)/SR
    x=np.sin(phase) if kind=='sine' else np.sign(np.sin(phase))
    if noise: x=x*(1-noise)+RNG.normal(0,1,n)*noise
    return x*env(n,.002,.04,.55,.12)*volume


def mix_mono(*signals):
    length=max(len(signal) for signal in signals)
    out=np.zeros(length,dtype=np.float64)
    for signal in signals:
        out[:len(signal)] += signal
    return out

def make_sfx():
    # UI
    sfx('ui-click', note(620,.08,'square',.25,.002,.02,.4,.03))
    sfx('ui-confirm', np.concatenate([note(523.25,.09,'triangle',.24),note(783.99,.13,'triangle',.22)]))
    sfx('ui-error', sweep(220,120,.18,'square',.25,.05))
    sfx('ui-page', sweep(360,620,.14,'triangle',.2,.02))
    # kroky
    for mat,base in [('grass',.16),('stone',.23),('crypt',.27)]:
        for i in range(3):
            n=int(.18*SR); noise=RNG.normal(0,1,n)
            if mat=='grass': x=lowpass(noise,.08)*np.exp(-np.arange(n)/(SR*.045))*base
            elif mat=='stone': x=mix_mono(highpass(noise,.12)*.35,drum('tom',.13,.3))[:n]*np.exp(-np.arange(n)/(SR*.075))*base
            else: x=mix_mono(lowpass(noise,.025)*.5,sweep(95,55,.16,'sine',.22))[:n]*base
            sfx(f'step-{mat}-{i+1}',x)
    # weapons/hits
    sfx('weapon-sword', sweep(1300,180,.24,'sine',.42,.28))
    sfx('weapon-mace', mix_mono(drum('tom',.32,.7),sweep(130,60,.32,'sine',.28,.18)))
    sfx('weapon-bow', np.concatenate([note(160,.06,'triangle',.28),sweep(900,320,.18,'sine',.25,.04)]))
    sfx('weapon-staff', sweep(220,850,.3,'triangle',.34,.05))
    sfx('hit-flesh', highpass(RNG.normal(0,1,int(.22*SR)),.045)*env(int(.22*SR),.001,.03,.3,.1)*.28)
    sfx('hit-armor', mix_mono(bell(760,.38,.35),bell(1120,.23,.18)))
    sfx('hit-critical', np.concatenate([sweep(180,1200,.16,'square',.34,.08),bell(1550,.42,.25)]))
    sfx('miss', sweep(700,260,.19,'sine',.18,.08))
    # world
    sfx('door-open', sweep(78,43,.65,'saw',.35,.22))
    sfx('door-close', np.concatenate([sweep(54,92,.45,'saw',.34,.2),drum('tom',.2,.36)]))
    sfx('door-locked', mix_mono(bell(180,.23,.28),bell(250,.18,.14)))
    sfx('lever', np.concatenate([sweep(120,75,.22,'square',.25,.08),bell(360,.25,.18)]))
    sfx('collect', np.concatenate([bell(523.25,.32,.25),bell(783.99,.45,.22)]))
    sfx('quest-update', np.concatenate([bell(392,.35,.18),bell(587.33,.5,.2)]))
    sfx('quest-complete', np.concatenate([bell(392,.38,.18),bell(493.88,.38,.18),bell(587.33,.5,.18),bell(783.99,.75,.2)]))
    sfx('trap-trigger', np.concatenate([sweep(1200,120,.35,'square',.38,.2),drum('snare',.35,.5)]))
    sfx('trap-disarm', np.concatenate([bell(440,.3,.18),bell(659.25,.42,.18)]))
    sfx('zone-transition', np.concatenate([sweep(130,390,.55,'triangle',.22,.02),bell(587.33,.7,.18)]),True)
    sfx('discovery', np.concatenate([bell(523.25,.35,.16),bell(659.25,.42,.17),bell(987.77,.7,.18)]))
    # magic
    sfx('magic-fire', sweep(140,720,.5,'saw',.35,.2))
    sfx('magic-frost', np.concatenate([bell(1180,.45,.24),sweep(880,430,.38,'sine',.22,.03)]))
    sfx('magic-lightning', mix_mono(highpass(RNG.normal(0,1,int(.42*SR)),.18)*env(int(.42*SR),.001,.02,.45,.2)*.33,sweep(1400,190,.42,'square',.22,.15)))
    sfx('magic-heal', np.concatenate([bell(392,.42,.16),bell(523.25,.48,.17),bell(659.25,.68,.18)]))
    sfx('magic-spirit', sweep(160,940,.7,'triangle',.28,.06))
    sfx('magic-poison', sweep(420,85,.62,'saw',.25,.18))
    sfx('magic-fail', sweep(280,105,.22,'square',.2,.05))
    sfx('tactical-pause', np.concatenate([bell(392,.25,.18),bell(293.66,.38,.18)]))
    sfx('tactical-resume', np.concatenate([bell(293.66,.25,.18),bell(392,.38,.18)]))
    # monsters, two samples per archetype
    specs={'hound':(360,95),'crawler':(130,58),'raider':(250,105),'sentinel':(92,46),'shade':(620,120),'boss':(185,42)}
    for kind,(hi,lo) in specs.items():
        sfx(f'monster-{kind}-attack',sweep(hi,lo,.5 if kind!='boss' else .8,'saw',.35,.28))
        death=np.concatenate([sweep(hi*.8,lo*.55,.75 if kind!='boss' else 1.3,'triangle',.34,.22),drum('tom',.3,.28)])
        sfx(f'monster-{kind}-death',death)

if __name__=='__main__':
    # 8 hudebních smyček, všechny mají celé takty a jsou navržené k opakování.
    music('menu',76,8,[(NOTE['D3'],NOTE['F3'],NOTE['A3']),(NOTE['C3'],NOTE['E3'],NOTE['G3']),(NOTE['As2'],NOTE['D3'],NOTE['F3']),(NOTE['A2'],NOTE['Cs3'],NOTE['E3'])],
          [NOTE['A4'],None,NOTE['F4'],NOTE['E4'],NOTE['D4'],None,NOTE['F4'],NOTE['A4']], 'night')
    music('vale-day',92,8,[(NOTE['D3'],NOTE['F3'],NOTE['A3']),(NOTE['G2'],NOTE['B2'],NOTE['D3']),(NOTE['C3'],NOTE['E3'],NOTE['G3']),(NOTE['D3'],NOTE['F3'],NOTE['A3'])],
          [NOTE['D5'],NOTE['F5'],NOTE['A5'],None,NOTE['G5'],NOTE['F5'],NOTE['E5'],NOTE['D5']], 'field')
    music('vale-night',70,8,[(NOTE['A2'],NOTE['C3'],NOTE['E3']),(NOTE['F2'],NOTE['A2'],NOTE['C3']),(NOTE['G2'],NOTE['B2'],NOTE['D3']),(NOTE['E2'],NOTE['Gs2'],NOTE['B2'])],
          [NOTE['E5'],None,NOTE['C5'],None,NOTE['B4'],NOTE['A4'],None,NOTE['E5']], 'night')
    music('pass-day',104,12,[(NOTE['E3'],NOTE['G3'],NOTE['B3']),(NOTE['D3'],NOTE['Fs3'],NOTE['A3']),(NOTE['C3'],NOTE['E3'],NOTE['G3']),(NOTE['B2'],NOTE['Ds3'],NOTE['Fs3'])],
          [NOTE['B4'],NOTE['E5'],NOTE['G5'],NOTE['Fs5'],NOTE['E5'],NOTE['D5'],NOTE['B4'],None], 'march')
    music('pass-night',78,8,[(NOTE['E3'],NOTE['G3'],NOTE['B3']),(NOTE['F3'],NOTE['A3'],NOTE['C4']),(NOTE['D3'],NOTE['Fs3'],NOTE['A3']),(NOTE['E3'],NOTE['G3'],NOTE['B3'])],
          [NOTE['E5'],None,NOTE['F5'],NOTE['E5'],NOTE['D5'],None,NOTE['B4'],NOTE['E5']], 'night')
    music('crypt',64,8,[(NOTE['Cs3'],NOTE['E3'],NOTE['Gs3']),(NOTE['A2'],NOTE['Cs3'],NOTE['E3']),(NOTE['B2'],NOTE['Ds3'],NOTE['Fs3']),(NOTE['Gs2'],NOTE['B2'],NOTE['Ds3'])],
          [NOTE['Gs4'],None,None,NOTE['E5'],None,NOTE['Ds5'],None,NOTE['Cs5']], 'crypt')
    music('combat',132,16,[(NOTE['D3'],NOTE['F3'],NOTE['A3']),(NOTE['C3'],NOTE['E3'],NOTE['G3']),(NOTE['As2'],NOTE['D3'],NOTE['F3']),(NOTE['A2'],NOTE['Cs3'],NOTE['E3'])],
          [NOTE['D5'],NOTE['A4'],NOTE['D5'],NOTE['F5'],NOTE['E5'],NOTE['C5'],NOTE['D5'],NOTE['A4']], 'combat')
    music('boss',148,16,[(NOTE['C3'],NOTE['Ds3'],NOTE['G3']),(NOTE['Cs3'],NOTE['E3'],NOTE['Gs3']),(NOTE['As2'],NOTE['D3'],NOTE['F3']),(NOTE['G2'],NOTE['B2'],NOTE['D3'])],
          [NOTE['C5'],NOTE['G4'],NOTE['Ds5'],NOTE['D5'],NOTE['Cs5'],NOTE['G4'],NOTE['C5'],NOTE['As4']], 'boss')
    ambience('forest',12,'forest'); ambience('mountain-wind',12,'wind'); ambience('crypt-depths',12,'crypt')
    make_sfx()
    print(f'Audio generated in {OUT}')
